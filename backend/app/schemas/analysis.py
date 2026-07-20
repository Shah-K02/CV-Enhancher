from uuid import UUID
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class AnalysisSectionFeedback(BaseModel):
    name: str
    score: int = Field(..., ge=0, le=100)
    feedback: List[str]
    suggestions: List[str]

class CVAnalysisResponse(BaseModel):
    id: Optional[UUID] = None
    cv_id: Optional[UUID] = None
    overall_score: int = Field(..., ge=0, le=100)
    sections: List[AnalysisSectionFeedback]
    analysis_type: str
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class JDMatchRequest(BaseModel):
    job_description: str
    cv_id: UUID

class JDMatchResponse(BaseModel):
    match_score: int
    missing_keywords: List[str]
    recommendations: List[str]
    tailoring_summary: str
