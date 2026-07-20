import uuid
from datetime import datetime
from sqlalchemy import func, ForeignKey, String, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.db.base import Base

class Analysis(Base):
    __tablename__ = "analyses"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    cv_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("cv_documents.id"))
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    overall_score: Mapped[int] = mapped_column(Integer)
    feedback_json: Mapped[dict] = mapped_column(JSONB)
    analysis_type: Mapped[str] = mapped_column(String(50), default="full")
    created_at: Mapped[datetime] = mapped_column(default=func.now())
    
    user: Mapped["User"] = relationship(back_populates="analyses")
    cv_document: Mapped["CVDocument"] = relationship(back_populates="analyses")
