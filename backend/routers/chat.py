from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from services import ai_service, prompts

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/", response_model=schemas.ChatResponse)
async def chat(req: schemas.ChatRequest, db: Session = Depends(get_db)):
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

    prompt = prompts.chat_prompt(company_dict, req.message)
    answer = await ai_service.call_ai(prompt, max_tokens=800)

    return schemas.ChatResponse(answer=answer)
