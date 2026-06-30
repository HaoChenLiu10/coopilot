import re
from typing import Dict, List


SKILL_KEYWORDS: Dict[str, List[str]] = {
    "Python": ["python"],
    "Java": ["java"],
    "C++": ["c++", "cpp"],
    "JavaScript": ["javascript", "js"],
    "TypeScript": ["typescript", "ts"],
    "React": ["react", "react.js", "reactjs"],
    "Node.js": ["node", "node.js"],
    "FastAPI": ["fastapi"],
    "Flask": ["flask"],
    "SQL": ["sql", "mysql", "postgresql", "sqlite"],
    "HTML": ["html"],
    "CSS": ["css"],
    "Git": ["git", "github"],
    "Docker": ["docker", "container"],
    "Linux": ["linux", "bash", "shell"],
    "REST API": ["rest api", "restful", "api"],
    "CI/CD": ["ci/cd", "github actions", "continuous integration"],
    "Pytest": ["pytest", "unit test", "unit testing"],
    "Playwright": ["playwright", "e2e test", "end-to-end"],
    "Pandas": ["pandas"],
    "NumPy": ["numpy"],
    "Selenium": ["selenium"],
    "Agile": ["agile", "scrum"],
}


def normalize_text(text: str) -> str:
    text = text.lower()
    text = text.replace("\n", " ")
    return f" {text} "


def extract_skills(text: str) -> List[str]:
    normalized = normalize_text(text)
    found_skills = []

    for skill, keywords in SKILL_KEYWORDS.items():
        for keyword in keywords:
            pattern = r"\b" + re.escape(keyword.lower()) + r"\b"
            if re.search(pattern, normalized):
                found_skills.append(skill)
                break

    return sorted(set(found_skills))


def generate_suggestions(missing_skills: List[str]) -> List[str]:
    suggestions = []

    for skill in missing_skills:
        if skill in ["Docker", "CI/CD", "Git"]:
            suggestions.append(
                f"Add a project bullet showing how you used {skill} in development or deployment."
            )
        elif skill in ["Pytest", "Playwright", "Selenium"]:
            suggestions.append(
                f"Add testing experience using {skill}, such as unit tests, API tests, or end-to-end tests."
            )
        elif skill in ["React", "TypeScript", "JavaScript", "HTML", "CSS"]:
            suggestions.append(
                f"Add a frontend bullet showing how you built user interfaces with {skill}."
            )
        elif skill in ["FastAPI", "REST API", "Flask", "Node.js"]:
            suggestions.append(
                f"Add a backend bullet showing how you built APIs using {skill}."
            )
        elif skill in ["SQL", "Pandas", "NumPy"]:
            suggestions.append(
                f"Add a data-related bullet showing how you used {skill} to process or analyze data."
            )
        else:
            suggestions.append(
                f"Consider adding a resume bullet related to {skill} if you have experience with it."
            )

    if not suggestions:
        suggestions.append(
            "Your resume already covers the main technical skills found in this job description."
        )

    return suggestions


def analyze_match(resume_text: str, job_text: str) -> dict:
    resume_skills = extract_skills(resume_text)
    job_skills = extract_skills(job_text)

    matched_skills = sorted(set(resume_skills) & set(job_skills))
    missing_skills = sorted(set(job_skills) - set(resume_skills))

    if len(job_skills) == 0:
        match_score = 0
    else:
        match_score = round((len(matched_skills) / len(job_skills)) * 100)

    return {
        "match_score": match_score,
        "resume_skills": resume_skills,
        "job_skills": job_skills,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "suggestions": generate_suggestions(missing_skills),
    }