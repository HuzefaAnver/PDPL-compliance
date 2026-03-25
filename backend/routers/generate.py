from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from services import ai_service, prompts

router = APIRouter(prefix="/generate", tags=["generate"])

DOC_TYPES = {
    "ropa": prompts.ropa_prompt,
    "dpia": prompts.dpia_prompt,
    "policy": prompts.policy_prompt,
    "risk-register": prompts.risk_register_prompt,
}


async def _generate_doc(doc_type: str, req: schemas.DocumentRequest, db: Session):
    company = db.query(models.Company).filter(models.Company.id == req.company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    company_dict = {
        "name": company.name,
        "industry": company.industry,
        "country": company.country,
        "employee_count": company.employee_count,
        "data_types": company.data_types or [],
        "tools_used": company.tools_used or [],
        "third_party_vendors": company.third_party_vendors or [],
        "processing_activities": company.processing_activities or "",
    }

    prompt_fn = DOC_TYPES[doc_type]
    prompt = prompt_fn(company_dict)
    content = await ai_service.call_ai(prompt, max_tokens=3000)

    # Upsert document in DB
    db_type = doc_type.replace("-", "_")
    existing = db.query(models.GeneratedDocument).filter(
        models.GeneratedDocument.company_id == req.company_id,
        models.GeneratedDocument.doc_type == db_type,
    ).first()

    if existing:
        existing.content = content
        db.commit()
        db.refresh(existing)
        return existing
    else:
        doc = models.GeneratedDocument(
            company_id=req.company_id,
            doc_type=db_type,
            content=content,
        )
        db.add(doc)
        db.commit()
        db.refresh(doc)
        return doc


@router.post("/ropa", response_model=schemas.DocumentResponse)
async def generate_ropa(req: schemas.DocumentRequest, db: Session = Depends(get_db)):
    return await _generate_doc("ropa", req, db)


@router.post("/dpia", response_model=schemas.DocumentResponse)
async def generate_dpia(req: schemas.DocumentRequest, db: Session = Depends(get_db)):
    return await _generate_doc("dpia", req, db)


@router.post("/policy", response_model=schemas.DocumentResponse)
async def generate_policy(req: schemas.DocumentRequest, db: Session = Depends(get_db)):
    return await _generate_doc("policy", req, db)


@router.post("/risk-register", response_model=schemas.DocumentResponse)
async def generate_risk_register(req: schemas.DocumentRequest, db: Session = Depends(get_db)):
    return await _generate_doc("risk-register", req, db)


@router.post("/all")
async def generate_all(req: schemas.DocumentRequest, db: Session = Depends(get_db)):
    """Generate all 4 documents at once for the dashboard."""
    results = {}
    for doc_type in DOC_TYPES:
        doc = await _generate_doc(doc_type, req, db)
        results[doc_type.replace("-", "_")] = {
            "id": doc.id,
            "doc_type": doc.doc_type,
            "created_at": doc.created_at.isoformat(),
        }
    return {"status": "success", "documents": results}


@router.get("/{company_id}/download/{doc_type}")
async def download_document(company_id: int, doc_type: str, db: Session = Depends(get_db)):
    """Download a generated document as plain text."""
    db_type = doc_type.replace("-", "_")
    doc = db.query(models.GeneratedDocument).filter(
        models.GeneratedDocument.company_id == company_id,
        models.GeneratedDocument.doc_type == db_type,
    ).first()

    if not doc:
        raise HTTPException(status_code=404, detail="Document not found. Generate it first.")

    filename = f"{doc_type}_{company_id}.md"
    return Response(
        content=doc.content,
        media_type="text/markdown",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
