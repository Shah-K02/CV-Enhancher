import uuid
from datetime import datetime
from sqlalchemy import String, func, ForeignKey, Text, Boolean, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base

class CVDocument(Base):
    __tablename__ = "cv_documents"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    filename: Mapped[str] = mapped_column(String(255))
    file_path: Mapped[str] = mapped_column(String(1024))
    extracted_text: Mapped[str] = mapped_column(Text)
    word_count: Mapped[int] = mapped_column(Integer, default=0)
    upload_date: Mapped[datetime] = mapped_column(default=func.now())
    is_embedded: Mapped[bool] = mapped_column(Boolean, default=False)
    
    user: Mapped["User"] = relationship(back_populates="cv_documents")
    analyses: Mapped[list["Analysis"]] = relationship(back_populates="cv_document", cascade="all, delete-orphan")
    chat_messages: Mapped[list["ChatHistory"]] = relationship(back_populates="cv_document", cascade="all, delete-orphan")
