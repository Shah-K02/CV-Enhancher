import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.analysis import Analysis
from app.schemas.analysis import CVAnalysisResponse

class AnalysisService:
    @staticmethod
    async def create_analysis(db: AsyncSession, cv_id: uuid.UUID, user_id: uuid.UUID, result: CVAnalysisResponse) -> Analysis:
        analysis = Analysis(
            cv_id=cv_id,
            user_id=user_id,
            overall_score=result.overall_score,
            feedback_json=[s.model_dump() for s in result.sections],
            analysis_type=result.analysis_type
        )
        db.add(analysis)
        await db.commit()
        await db.refresh(analysis)
        return analysis

    @staticmethod
    async def get_analyses_for_cv(db: AsyncSession, cv_id: uuid.UUID, user_id: uuid.UUID) -> list[Analysis]:
        result = await db.execute(
            select(Analysis)
            .where(Analysis.cv_id == cv_id, Analysis.user_id == user_id)
            .order_by(Analysis.created_at.desc())
        )
        return list(result.scalars().all())
