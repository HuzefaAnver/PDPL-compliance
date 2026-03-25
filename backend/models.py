from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, Float
from sqlalchemy.sql import func
from database import Base


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    industry = Column(String(100), nullable=False)
    data_types = Column(JSON, default=list)        # ["PII", "financial", "health", ...]
    tools_used = Column(JSON, default=list)         # ["CRM", "payment_gateway", ...]
    third_party_vendors = Column(JSON, default=list)
    processing_activities = Column(Text, default="")
    employee_count = Column(String(50), default="")
    country = Column(String(100), default="Saudi Arabia")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class GeneratedDocument(Base):
    __tablename__ = "generated_documents"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, index=True)
    doc_type = Column(String(50))   # ropa | dpia | policy | risk_register
    content = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ComplianceScore(Base):
    __tablename__ = "compliance_scores"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, index=True, unique=True)
    overall_score = Column(Float, default=0.0)
    risk_level = Column(String(20), default="Low")
    gaps = Column(JSON, default=list)
    recommendations = Column(JSON, default=list)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())
