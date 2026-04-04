from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routers import assessment, auth, results

# Create all DB tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PDPL Compliance Assessment API",
    description="MVP API for Saudi Arabia PDPL compliance assessment platform",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(assessment.router)
app.include_router(auth.router)
app.include_router(results.router)


@app.get("/")
def root():
    return {
        "status": "online",
        "name": "PDPL Compliance Assessment Platform",
        "version": "2.0.0-mvp",
        "docs": "/docs",
        "endpoints": [
            "POST /submit-assessment",
            "POST /signup",
            "GET  /results/{user_id}",
            "POST /generate-summary",
        ],
    }


@app.get("/health")
def health():
    return {"status": "healthy"}
