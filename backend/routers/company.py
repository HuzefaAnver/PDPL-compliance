from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from services.gap_analysis import run_gap_analysis

router = APIRouter(prefix="/companies", tags=["companies"])


@router.post("/", response_model=schemas.CompanyResponse)
def create_company(company: schemas.CompanyCreate, db: Session = Depends(get_db)):
    db_company = models.Company(**company.model_dump())
    db.add(db_company)
    db.commit()
    db.refresh(db_company)

    # Run initial gap analysis and store score
    company_dict = company.model_dump()
    analysis = run_gap_analysis(company_dict)

    existing_score = db.query(models.ComplianceScore).filter(
        models.ComplianceScore.company_id == db_company.id
    ).first()

    if existing_score:
        for k, v in analysis.items():
            setattr(existing_score, k, v)
        existing_score.company_id = db_company.id
    else:
        score_record = models.ComplianceScore(
            company_id=db_company.id,
            overall_score=analysis["overall_score"],
            risk_level=analysis["risk_level"],
            gaps=analysis["gaps"],
            recommendations=analysis["recommendations"],
        )
        db.add(score_record)

    db.commit()
    return db_company


@router.get("/{company_id}", response_model=schemas.CompanyResponse)
def get_company(company_id: int, db: Session = Depends(get_db)):
    company = db.query(models.Company).filter(models.Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company


@router.get("/{company_id}/dashboard", response_model=schemas.DashboardResponse)
def get_dashboard(company_id: int, db: Session = Depends(get_db)):
    company = db.query(models.Company).filter(models.Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    score = db.query(models.ComplianceScore).filter(
        models.ComplianceScore.company_id == company_id
    ).first()

    docs = db.query(models.GeneratedDocument).filter(
        models.GeneratedDocument.company_id == company_id
    ).all()

    return schemas.DashboardResponse(
        company=company,
        compliance_score=score,
        documents=docs,
    )
