import { useEffect, useState } from "react";
import "./App.css";

type AnalyzeResult = {
  match_score: number;
  matched_skills: string[];
  missing_skills: string[];
  suggestions: string[];
};

type ApplicationRecord = {
  id: number;
  company_name: string;
  job_title: string;
  resume_text: string;
  job_text: string;
  match_score: number;
  matched_skills: string[];
  missing_skills: string[];
  suggestions: string[];
  status: "Applied" | "Interview" | "Rejected" | "Offer";
  created_at: string;
};

const API_BASE_URL = "http://127.0.0.1:8000";

function App() {
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [jobText, setJobText] = useState("");
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const loadApplications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/applications`);
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error("Failed to load applications:", error);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const analyzeMatch = async () => {
    if (!resumeText.trim() || !jobText.trim()) {
      alert("Please enter both resume text and job description.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
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

  const saveApplication = async () => {
    if (!companyName.trim() || !jobTitle.trim()) {
      alert("Please enter company name and job title.");
      return;
    }

    if (!resumeText.trim() || !jobText.trim()) {
      alert("Please enter both resume text and job description.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_name: companyName,
          job_title: jobTitle,
          resume_text: resumeText,
          job_text: jobText,
          status: "Applied",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save application.");
      }

      const savedApplication = await response.json();
      setResult(savedApplication);
      await loadApplications();

      setCompanyName("");
      setJobTitle("");
    } catch (error) {
      console.error(error);
      alert("Failed to save application. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    applicationId: number,
    status: ApplicationRecord["status"]
  ) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/applications/${applicationId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status.");
      }

      await loadApplications();
    } catch (error) {
      console.error(error);
      alert("Failed to update application status.");
    }
  };

  const deleteApplication = async (applicationId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete application.");
      }

      await loadApplications();
    } catch (error) {
      console.error(error);
      alert("Failed to delete application.");
    }
  };

  return (
    <main className="container">
      <section className="hero">
        <p className="eyebrow">Co-op Application Platform</p>
        <h1>Co-opPilot</h1>
        <p className="subtitle">
          Analyze resume-job fit, calculate skill match scores, and track saved
          co-op applications in one place.
        </p>
      </section>

      <section className="field-grid">
        <div className="input-card">
          <label>Company Name</label>
          <input
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            placeholder="e.g. Propel Holdings"
          />
        </div>

        <div className="input-card">
          <label>Job Title</label>
          <input
            value={jobTitle}
            onChange={(event) => setJobTitle(event.target.value)}
            placeholder="e.g. Software Developer Intern"
          />
        </div>
      </section>

      <section className="input-grid">
        <div className="input-card">
          <h2>Resume Text</h2>
          <textarea
            value={resumeText}
            onChange={(event) => setResumeText(event.target.value)}
            placeholder="Paste your resume text here..."
          />
        </div>

        <div className="input-card">
          <h2>Job Description</h2>
          <textarea
            value={jobText}
            onChange={(event) => setJobText(event.target.value)}
            placeholder="Paste the job description here..."
          />
        </div>
      </section>

      <div className="actions">
        <button onClick={analyzeMatch} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Match"}
        </button>

        <button className="secondary-button" onClick={saveApplication} disabled={loading}>
          Save Application
        </button>
      </div>

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

      <section className="applications-card">
        <div className="section-header">
          <h2>Saved Applications</h2>
          <p>{applications.length} total</p>
        </div>

        {applications.length === 0 ? (
          <p className="muted">No saved applications yet.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Job Title</th>
                  <th>Match</th>
                  <th>Missing Skills</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {applications.map((application) => (
                  <tr key={application.id}>
                    <td>{application.company_name}</td>
                    <td>{application.job_title}</td>
                    <td>{application.match_score}%</td>
                    <td>
                      {application.missing_skills.length > 0
                        ? application.missing_skills.join(", ")
                        : "None"}
                    </td>
                    <td>
                      <select
                        value={application.status}
                        onChange={(event) =>
                          updateStatus(
                            application.id,
                            event.target.value as ApplicationRecord["status"]
                          )
                        }
                      >
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Offer">Offer</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => deleteApplication(application.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;