import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.schemas.analysis import CVAnalysisResponse, JDMatchRequest, JDMatchResponse
from app.services.cv_service import CVService
from app.services.analysis_service import AnalysisService
from app.ai.analyser import CVAnalyser
from app.ai.jd_matcher import JDMatcher

router = APIRouter()

@router.post("/{cv_id}/analyse", response_model=CVAnalysisResponse)
async def analyse_cv(cv_id: uuid.UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    cv = await CVService.get_cv_by_id(db, cv_id, current_user.id)
    if not cv:
        raise HTTPException(status_code=404, detail="CV not found")
        
    analyser = CVAnalyser()
    result = await analyser.analyse(cv.extracted_text)
    
    analysis = await AnalysisService.create_analysis(db, cv_id, current_user.id, result)
    result.id = analysis.id
    result.cv_id = cv_id
    result.created_at = analysis.created_at
    return result

@router.get("/{cv_id}/history")
async def get_analysis_history(cv_id: uuid.UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    return await AnalysisService.get_analyses_for_cv(db, cv_id, current_user.id)

@router.post("/{cv_id}/match-jd", response_model=JDMatchResponse)
async def match_jd(cv_id: uuid.UUID, request: JDMatchRequest, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    if cv_id != request.cv_id:
        raise HTTPException(status_code=400, detail="CV ID mismatch")
        
    cv = await CVService.get_cv_by_id(db, cv_id, current_user.id)
    if not cv:
        raise HTTPException(status_code=404, detail="CV not found")
        
    matcher = JDMatcher()
    return await matcher.match(cv.extracted_text, request.job_description)
