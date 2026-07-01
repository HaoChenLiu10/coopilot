\# Co-opPilot

[![Co-opPilot CI](https://github.com/HaoChenLiu10/coopilot/actions/workflows/ci.yml/badge.svg)](https://github.com/HaoChenLiu10/coopilot/actions/workflows/ci.yml)


Co-opPilot is a full-stack web application that helps students analyze how well their resume matches a co-op job description. It extracts technical skills from both the resume and job posting, calculates a match score, identifies missing skills, and provides resume improvement suggestions.



\## Features



\- Resume and job description analysis

\- Technical skill extraction

\- Match score calculation

\- Matched skill identification

\- Missing skill identification

\- Resume improvement suggestions

\- React + TypeScript frontend

\- FastAPI backend

\- Pytest unit tests

## Demo

![Co-opPilot Demo](screenshots/coopilot-demo.png)

## API Documentation

![FastAPI Docs](screenshots/api-docs.png)

## Continuous Integration

![GitHub Actions CI](screenshots/ci-pipeline.png)


\## Tech Stack



\### Frontend

\- React

\- TypeScript

\- Vite

\- CSS



\### Backend

\- Python

\- FastAPI

\- Pydantic

\- Uvicorn



\### Testing

\- Pytest



\### Version Control

\- Git

\- GitHub



\## Project Structure



```text

coopilot/

├── backend/

│   ├── app/

│   │   ├── \_\_init\_\_.py

│   │   ├── analyzer.py

│   │   └── main.py

│   ├── tests/

│   │   └── test\_analyzer.py

│   ├── pytest.ini

│   └── requirements.txt

│

├── frontend/

│   ├── src/

│   │   ├── App.tsx

│   │   └── App.css

│   ├── package.json

│   └── vite.config.ts

│

├── README.md

└── .gitignore

