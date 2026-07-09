from contextlib import asynccontextmanager
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.analyzer import analyze_match
from app.database import (
    create_application,
    delete_application,
    init_db,
    list_applications,
    update_application_status,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="Co-opPilot API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    resume_text: str
    job_text: str


class ApplicationCreate(BaseModel):
    company_name: str
    job_title: str
    resume_text: str
    job_text: str
    status: Literal["Applied", "Interview", "Rejected", "Offer"] = "Applied"


class StatusUpdate(BaseModel):
    status: Literal["Applied", "Interview", "Rejected", "Offer"]


@app.get("/")
def root():
    return {"message": "Co-opPilot API is running"}


@app.post("/analyze")
def analyze(request: AnalyzeRequest):
    return analyze_match(request.resume_text, request.job_text)


@app.post("/applications")
def save_application(request: ApplicationCreate):
    analysis = analyze_match(request.resume_text, request.job_text)

    application = {
        "company_name": request.company_name,
        "job_title": request.job_title,
        "resume_text": request.resume_text,
        "job_text": request.job_text,
        "match_score": analysis["match_score"],
        "matched_skills": analysis["matched_skills"],
        "missing_skills": analysis["missing_skills"],
        "suggestions": analysis["suggestions"],
        "status": request.status,
    }

    return create_application(application)


@app.get("/applications")
def get_applications():
    return list_applications()


@app.patch("/applications/{application_id}/status")
def update_status(application_id: int, request: StatusUpdate):
    updated = update_application_status(application_id, request.status)

    if updated is None:
        raise HTTPException(status_code=404, detail="Application not found")

    return updated


@app.delete("/applications/{application_id}")
def remove_application(application_id: int):
    deleted = delete_application(application_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Application not found")

    return {"message": "Application deleted successfully"}