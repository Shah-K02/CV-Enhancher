import uuid
from datetime import datetime
from sqlalchemy import func, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base

class ChatHistory(Base):
    __tablename__ = "chat_history"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    cv_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("cv_documents.id"))
    role: Mapped[str] = mapped_column(String(50)) # user or assistant
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(default=func.now())
    
    user: Mapped["User"] = relationship(back_populates="chat_messages")
    cv_document: Mapped["CVDocument"] = relationship(back_populates="chat_messages")
