import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.models.chat_history import ChatHistory

class ChatService:
    @staticmethod
    async def save_message(db: AsyncSession, user_id: uuid.UUID, cv_id: uuid.UUID, role: str, content: str) -> ChatHistory:
        msg = ChatHistory(
            user_id=user_id,
            cv_id=cv_id,
            role=role,
            content=content
        )
        db.add(msg)
        await db.commit()
        await db.refresh(msg)
        return msg

    @staticmethod
    async def get_chat_history(db: AsyncSession, user_id: uuid.UUID, cv_id: uuid.UUID) -> list[ChatHistory]:
        result = await db.execute(
            select(ChatHistory)
            .where(ChatHistory.cv_id == cv_id, ChatHistory.user_id == user_id)
            .order_by(ChatHistory.created_at.asc())
        )
        return list(result.scalars().all())

    @staticmethod
    async def clear_history(db: AsyncSession, user_id: uuid.UUID, cv_id: uuid.UUID) -> int:
        result = await db.execute(
            delete(ChatHistory)
            .where(ChatHistory.cv_id == cv_id, ChatHistory.user_id == user_id)
        )
        await db.commit()
        return result.rowcount
