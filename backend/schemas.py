from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime


# ── Assessment ────────────────────────────────────────────────
class AssessmentCreate(BaseModel):
    # Section A
    company_name: str = Field(..., min_length=2)
    user_name: str = Field(..., min_length=2)
    email: str
    industry: str

    # Section B
    data_volume: str           # "<100" | "100-10000" | ">10000"
    data_types: List[str] = [] # ["basic","financial","sensitive"]
    stores_regularly: str      # "yes" | "sometimes" | "no"

    # Section C (Q4-Q10)
    knows_data_location: str   # "yes" | "partially" | "no"
    shares_third_party: str    # "documented" | "not_documented" | "not_sure"
    vendor_list: str           # "yes" | "partial" | "no"
    privacy_policy: str        # "yes" | "basic" | "no"
    internal_rules: str        # "yes" | "informal" | "no"
    breach_plan: str           # "yes" | "basic" | "no"
    user_rights: str           # "yes" | "informal" | "no"


class AssessmentResponse(BaseModel):
    id: int
    score: int
    risk_level: str
    gaps: List[str]
    created_at: datetime

    class Config:
        from_attributes = True


# ── Signup ────────────────────────────────────────────────────
class SignupRequest(BaseModel):
    email: str
    password: str = Field(..., min_length=6)
    assessment_id: int


class SignupResponse(BaseModel):
    user_id: int
    email: str
    assessment_id: int


# ── Results ───────────────────────────────────────────────────
class ResultsResponse(BaseModel):
    user_id: int
    email: str
    company_name: str
    industry: str
    score: int
    risk_level: str
    gaps: List[str]
    ai_summary: Optional[str] = None
    assessment_id: int


# ── AI Summary ────────────────────────────────────────────────
class SummaryRequest(BaseModel):
    user_id: int


class SummaryResponse(BaseModel):
    summary: str
