import os
import uuid
import aiofiles
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import get_settings
from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.schemas.cv import CVUploadResponse, CVListResponse, CVDetailResponse
from app.services.cv_service import CVService
from app.ai.text_extractor import TextExtractor
from app.ai.embedder import CVEmbedder
from app.ai.vector_store import CVVectorStore

router = APIRouter()
settings = get_settings()

async def process_embedding(user_id: str, cv_id: str, text: str) -> None:
    """Background task: chunk CV text, generate embeddings, build FAISS index."""
    import structlog as _structlog
    _logger = _structlog.get_logger()
    try:
        from app.db.session import SessionLocal
        embedder = CVEmbedder()
        store = CVVectorStore()
        chunks = embedder.chunk_text(text)
        embeddings = embedder.embed_chunks(chunks)
        store.build_index(user_id, cv_id, chunks, embeddings)
        async with SessionLocal() as db:
            await CVService.mark_embedded(db, uuid.UUID(cv_id))
        _logger.info("embedding_complete", cv_id=cv_id)
    except Exception as e:
        _logger.error("embedding_failed", cv_id=cv_id, error=str(e))

@router.post("/upload", response_model=CVUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_cv(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not file.filename.endswith((".pdf", ".docx")):
        raise HTTPException(status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, detail="Only PDF and DOCX files are supported")
    
    # Read file and check size
    contents = await file.read()
    if len(contents) > settings.max_upload_size_mb * 1024 * 1024:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="File too large")
        
    file_id = str(uuid.uuid4())
    ext = file.filename.split(".")[-1]
    safe_filename = f"{file_id}.{ext}"
    file_path = os.path.join(settings.upload_dir, safe_filename)
    
    async with aiofiles.open(file_path, "wb") as out_file:
        await out_file.write(contents)
        
    try:
        text = TextExtractor.extract(file_path, file.filename)
    except Exception as e:
        os.remove(file_path)
        raise HTTPException(status_code=400, detail=str(e))
        
    cv = await CVService.save_cv(db, current_user.id, file.filename, file_path, text)
    
    background_tasks.add_task(process_embedding, str(current_user.id), str(cv.id), text)
    
    return cv

@router.get("/", response_model=list[CVUploadResponse])
async def list_cvs(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> list:
    """List all CVs uploaded by the authenticated user, newest first."""
    cvs = await CVService.get_user_cvs(db, current_user.id)
    return cvs

@router.get("/{cv_id}", response_model=CVDetailResponse)
async def get_cv(cv_id: uuid.UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    cv = await CVService.get_cv_by_id(db, cv_id, current_user.id)
    if not cv:
        raise HTTPException(status_code=404, detail="CV not found")
    return CVDetailResponse.from_orm_model(cv)

@router.delete("/{cv_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_cv(cv_id: uuid.UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    success = await CVService.delete_cv(db, cv_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="CV not found")
    
    store = CVVectorStore()
    store.delete_index(str(current_user.id), str(cv_id))
    return None
