from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


# ── Company ──────────────────────────────────────────────────
class CompanyCreate(BaseModel):
    name: str = Field(..., min_length=2)
    industry: str
    data_types: List[str] = []
    tools_used: List[str] = []
    third_party_vendors: List[str] = []
    processing_activities: str = ""
    employee_count: str = ""
    country: str = "Saudi Arabia"


class CompanyResponse(CompanyCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ── Documents ─────────────────────────────────────────────────
class DocumentRequest(BaseModel):
    company_id: int


class DocumentResponse(BaseModel):
    id: int
    company_id: int
    doc_type: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


# ── Compliance Score ──────────────────────────────────────────
class ComplianceScoreResponse(BaseModel):
    company_id: int
    overall_score: float
    risk_level: str
    gaps: List[dict]
    recommendations: List[str]

    class Config:
        from_attributes = True


# ── Chat ─────────────────────────────────────────────────────
class ChatRequest(BaseModel):
    company_id: int
    message: str


class ChatResponse(BaseModel):
    answer: str


# ── Dashboard ─────────────────────────────────────────────────
class DashboardResponse(BaseModel):
    company: CompanyResponse
    compliance_score: Optional[ComplianceScoreResponse]
    documents: List[DocumentResponse]
