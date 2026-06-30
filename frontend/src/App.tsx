import { useState } from "react";
import "./App.css";

type AnalyzeResult = {
  match_score: number;
  resume_skills: string[];
  job_skills: string[];
  matched_skills: string[];
  missing_skills: string[];
  suggestions: string[];
};

function App() {
  const [resumeText, setResumeText] = useState("");
  const [jobText, setJobText] = useState("");
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeMatch = async () => {
    if (!resumeText.trim() || !jobText.trim()) {
      alert("Please enter both resume text and job description.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume_text: resumeText,
          job_text: jobText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze match.");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Make sure the backend is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <section className="hero">
        <p className="eyebrow">Co-op Application Tool</p>
        <h1>Co-opPilot</h1>
        <p className="subtitle">
          Analyze a resume against a job description, calculate a skill match score,
          and identify missing technical requirements.
        </p>
      </section>

      <section className="input-grid">
        <div className="input-card">
          <h2>Resume Text</h2>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here..."
          />
        </div>

        <div className="input-card">
          <h2>Job Description</h2>
          <textarea
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            placeholder="Paste the job description here..."
          />
        </div>
      </section>

      <button onClick={analyzeMatch} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Match"}
      </button>

      {result && (
        <section className="result-card">
          <div className="score-box">
            <p>Match Score</p>
            <h2>{result.match_score}%</h2>
          </div>

          <div className="result-grid">
            <div>
              <h3>Matched Skills</h3>
              <div className="tag-list">
                {result.matched_skills.length > 0 ? (
                  result.matched_skills.map((skill) => (
                    <span className="tag matched" key={skill}>
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="muted">No matched skills found.</p>
                )}
              </div>
            </div>

            <div>
              <h3>Missing Skills</h3>
              <div className="tag-list">
                {result.missing_skills.length > 0 ? (
                  result.missing_skills.map((skill) => (
                    <span className="tag missing" key={skill}>
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="muted">No missing skills found.</p>
                )}
              </div>
            </div>
          </div>

          <div className="suggestions">
            <h3>Suggestions</h3>
            <ul>
              {result.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}

export default App;
