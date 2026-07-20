import os
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.cv_document import CVDocument

class CVService:
    @staticmethod
    async def save_cv(db: AsyncSession, user_id: uuid.UUID, filename: str, file_path: str, extracted_text: str) -> CVDocument:
        word_count = len(extracted_text.split())
        cv = CVDocument(
            user_id=user_id,
            filename=filename,
            file_path=file_path,
            extracted_text=extracted_text,
            word_count=word_count
        )
        db.add(cv)
        await db.commit()
        await db.refresh(cv)
        return cv

    @staticmethod
    async def get_user_cvs(db: AsyncSession, user_id: uuid.UUID) -> list[CVDocument]:
        result = await db.execute(select(CVDocument).where(CVDocument.user_id == user_id).order_by(CVDocument.upload_date.desc()))
        return list(result.scalars().all())

    @staticmethod
    async def get_cv_by_id(db: AsyncSession, cv_id: uuid.UUID, user_id: uuid.UUID) -> CVDocument | None:
        result = await db.execute(
            select(CVDocument).where(CVDocument.id == cv_id, CVDocument.user_id == user_id)
        )
        return result.scalars().first()

    @staticmethod
    async def delete_cv(db: AsyncSession, cv_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        cv = await CVService.get_cv_by_id(db, cv_id, user_id)
        if not cv:
            return False
        
        # Delete file
        if os.path.exists(cv.file_path):
            os.remove(cv.file_path)
            
        await db.delete(cv)
        await db.commit()
        return True

    @staticmethod
    async def mark_embedded(db: AsyncSession, cv_id: uuid.UUID) -> None:
        result = await db.execute(select(CVDocument).where(CVDocument.id == cv_id))
        cv = result.scalars().first()
        if cv:
            cv.is_embedded = True
            await db.commit()
