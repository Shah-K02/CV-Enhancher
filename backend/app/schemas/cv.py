from uuid import UUID
from datetime import datetime
from pydantic import BaseModel

class CVUploadResponse(BaseModel):
    id: UUID
    filename: str
    word_count: int
    upload_date: datetime
    is_embedded: bool
    
    class Config:
        from_attributes = True

class CVListResponse(BaseModel):
    cvs: list[CVUploadResponse]

class CVDetailResponse(CVUploadResponse):
    extracted_text_preview: str
    
    @classmethod
    def from_orm_model(cls, obj):
        text = obj.extracted_text or ""
        preview = text[:500] + ("..." if len(text) > 500 else "")
        return cls(
            id=obj.id,
            filename=obj.filename,
            word_count=obj.word_count,
            upload_date=obj.upload_date,
            is_embedded=obj.is_embedded,
            extracted_text_preview=preview
        )
