from app.analyzer import extract_skills, analyze_match


def test_extract_skills():
    text = "I used Python, React, SQL, Docker, and Git."
    skills = extract_skills(text)

    assert "Python" in skills
    assert "React" in skills
    assert "SQL" in skills
    assert "Docker" in skills
    assert "Git" in skills


def test_analyze_match():
    resume = "I built a Python and React project with SQL."
    job = "Required skills: Python, React, SQL, Docker."

    result = analyze_match(resume, job)

    assert result["match_score"] == 75
    assert "Docker" in result["missing_skills"]
    assert "Python" in result["matched_skills"]
    assert "React" in result["matched_skills"]
    assert "SQL" in result["matched_skills"]


def test_no_job_skills():
    resume = "I know Python and React."
    job = "We are hiring a motivated student."

    result = analyze_match(resume, job)

    assert result["match_score"] == 0
    assert result["job_skills"] == []