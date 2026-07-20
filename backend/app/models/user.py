import uuid
from datetime import datetime
from sqlalchemy import String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base

class User(Base):
    __tablename__ = "users"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(default=func.now())
    updated_at: Mapped[datetime] = mapped_column(default=func.now(), onupdate=func.now())
    
    # relationships
    cv_documents: Mapped[list["CVDocument"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    chat_messages: Mapped[list["ChatHistory"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    analyses: Mapped[list["Analysis"]] = relationship(back_populates="user", cascade="all, delete-orphan")
