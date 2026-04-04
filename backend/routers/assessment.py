from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from services.scoring import compute_score

router = APIRouter(prefix="/submit-assessment", tags=["assessment"])


@router.post("/", response_model=schemas.AssessmentResponse)
def submit_assessment(data: schemas.AssessmentCreate, db: Session = Depends(get_db)):
    """Receive assessment answers, compute RAG score, store and return result."""
    score, risk_level, gaps = compute_score(data.model_dump())

    assessment = models.Assessment(
        company_name=data.company_name,
        user_name=data.user_name,
        email=data.email,
        industry=data.industry,
        data_volume=data.data_volume,
        data_types=data.data_types,
        stores_regularly=data.stores_regularly,
        knows_data_location=data.knows_data_location,
        shares_third_party=data.shares_third_party,
        vendor_list=data.vendor_list,
        privacy_policy=data.privacy_policy,
        internal_rules=data.internal_rules,
        breach_plan=data.breach_plan,
        user_rights=data.user_rights,
        score=score,
        risk_level=risk_level,
        gaps=gaps,
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    return assessment
