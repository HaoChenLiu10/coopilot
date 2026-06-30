from fastapi import FastAPI
from pydantic import BaseModel

from app.analyzer import analyze_match


app = FastAPI(title="Co-opPilot API")


class AnalyzeRequest(BaseModel):
    resume_text: str
    job_text: str


@app.get("/")
def root():
    return {"message": "Co-opPilot API is running"}


@app.post("/analyze")
def analyze(request: AnalyzeRequest):
    return analyze_match(request.resume_text, request.job_text)