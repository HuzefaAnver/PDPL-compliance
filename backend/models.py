from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, Float, Boolean
from sqlalchemy.sql import func
from database import Base


class Assessment(Base):
    """Stores the raw assessment answers + computed score."""
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)

    # Section A – Basic Info
    company_name = Column(String(200), nullable=False)
    user_name = Column(String(200), nullable=False)
    email = Column(String(200), nullable=False)
    industry = Column(String(100), nullable=False)

    # Section B – Risk & Data Profile
    data_volume = Column(String(50))          # "<100" | "100-10000" | ">10000"
    data_types = Column(JSON, default=list)   # ["basic","financial","sensitive"]
    stores_regularly = Column(String(20))     # "yes" | "sometimes" | "no"

    # Section C – Compliance Maturity (Q4-Q10)
    knows_data_location = Column(String(20))  # "yes" | "partially" | "no"
    shares_third_party = Column(String(30))   # "documented" | "not_documented" | "not_sure"
    vendor_list = Column(String(20))          # "yes" | "partial" | "no"
    privacy_policy = Column(String(20))       # "yes" | "basic" | "no"
    internal_rules = Column(String(20))       # "yes" | "informal" | "no"
    breach_plan = Column(String(20))          # "yes" | "basic" | "no"
    user_rights = Column(String(20))          # "yes" | "informal" | "no"

    # Computed
    score = Column(Integer, default=0)        # 0-20
    risk_level = Column(String(10), default="RED")  # RED | AMBER | GREEN
    gaps = Column(JSON, default=list)

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class User(Base):
    """Signup gate – users created after completing assessment."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(200), nullable=False, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    assessment_id = Column(Integer, index=True)
    ai_summary = Column(Text, default=None)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
