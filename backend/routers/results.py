from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from services.ai_service import generate_compliance_summary

router = APIRouter(tags=["results"])


@router.get("/results/{user_id}", response_model=schemas.ResultsResponse)
def get_results(user_id: int, db: Session = Depends(get_db)):
    """Fetch full compliance results for a signed-up user."""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    assessment = db.query(models.Assessment).filter(
        models.Assessment.id == user.assessment_id
    ).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    return schemas.ResultsResponse(
        user_id=user.id,
        email=user.email,
        company_name=assessment.company_name,
        industry=assessment.industry,
        score=assessment.score,
        risk_level=assessment.risk_level,
        gaps=assessment.gaps or [],
        ai_summary=user.ai_summary,
        assessment_id=assessment.id,
    )


@router.post("/generate-summary", response_model=schemas.SummaryResponse)
async def generate_summary(req: schemas.SummaryRequest, db: Session = Depends(get_db)):
    """Generate (or regenerate) AI compliance summary and persist it."""
    user = db.query(models.User).filter(models.User.id == req.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    assessment = db.query(models.Assessment).filter(
        models.Assessment.id == user.assessment_id
    ).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    assessment_dict = {
        "company_name": assessment.company_name,
        "industry": assessment.industry,
        "data_volume": assessment.data_volume,
        "data_types": assessment.data_types or [],
        "score": assessment.score,
        "risk_level": assessment.risk_level,
        "gaps": assessment.gaps or [],
    }

    summary = await generate_compliance_summary(assessment_dict)

    # Persist so future result fetches include it
    user.ai_summary = summary
    db.commit()

    return schemas.SummaryResponse(summary=summary)
