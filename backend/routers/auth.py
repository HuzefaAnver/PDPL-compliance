import hashlib
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas

router = APIRouter(prefix="/signup", tags=["auth"])


def _hash(password: str) -> str:
    """Simple SHA-256 hash — adequate for a demo MVP."""
    return hashlib.sha256(password.encode()).hexdigest()


@router.post("/", response_model=schemas.SignupResponse)
def signup(data: schemas.SignupRequest, db: Session = Depends(get_db)):
    """Create a user account gated behind completing an assessment."""
    # Verify assessment exists
    assessment = db.query(models.Assessment).filter(
        models.Assessment.id == data.assessment_id
    ).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    # Upsert: allow re-signup with same email (e.g. demo resets)
    existing = db.query(models.User).filter(models.User.email == data.email).first()
    if existing:
        existing.assessment_id = data.assessment_id
        db.commit()
        db.refresh(existing)
        return schemas.SignupResponse(
            user_id=existing.id,
            email=existing.email,
            assessment_id=existing.assessment_id,
        )

    user = models.User(
        email=data.email,
        password_hash=_hash(data.password),
        assessment_id=data.assessment_id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return schemas.SignupResponse(
        user_id=user.id,
        email=user.email,
        assessment_id=user.assessment_id,
    )
