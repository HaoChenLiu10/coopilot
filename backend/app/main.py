from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.analyzer import analyze_match


app = FastAPI(title="Co-opPilot API")

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


@app.get("/")
def root():
    return {"message": "Co-opPilot API is running"}


@app.post("/analyze")
def analyze(request: AnalyzeRequest):
    return analyze_match(request.resume_text, request.job_text)