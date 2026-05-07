import React, { useState, useRef } from 'react'
import '../style/home.scss'
import { useInterview } from '../hooks/useInterview'
import { useNavigate } from 'react-router'

const Home = () => {
  const { loading, generateReport } = useInterview();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [error, setError] = useState("");
  const resumeRef = useRef();
  const navigate = useNavigate();

  const handleGenerateReport = async () => {
    setError("");
    const resumeFile = resumeRef.current.files[0];

    if (!resumeFile) {
      setError("Please upload your resume (PDF).");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Please enter a job description.");
      return;
    }

    const result = await generateReport({ resumeFile, jobDescription, selfDescription });
    if (result.success) {
      navigate(`/interview/${result.data.interviewReport._id}`);
    } else {
      // Show the real server error so the user knows exactly what went wrong
      const raw = result.error || "";
      const isQuota = raw.toLowerCase().includes("quota") || raw.toLowerCase().includes("429") || raw.toLowerCase().includes("resource_exhausted");
      if (isQuota) {
        setError("AI quota exceeded — the free-tier daily limit is reached. Please wait a few hours and try again, or use a different API key.");
      } else {
        setError(raw || "Failed to generate report. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <main className="loading-screen">
        <div className="loader-content">
          <div className="spinner" />
          <h2>Analyzing your profile...</h2>
          <p>Our AI is generating your personalized interview report. This may take a moment.</p>
        </div>
      </main>
    );
  }

  return (
    <main className='home'>
      <div className="left">
        <label className="panel-label">Job Description</label>
        <textarea
          id="jobdescription"
          placeholder='Paste the job description here...'
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>
      <div className="right">
        <div className="input-gropup">
          <label htmlFor="resume">Upload Resume (PDF)</label>
          <input
            type="file"
            name="resume"
            id="resume"
            accept='.pdf'
            ref={resumeRef}
          />
        </div>
        <div className="input-gropup">
          <label htmlFor="selfDescription">Self Description</label>
          <textarea
            name="selfDescription"
            id="selfDescription"
            placeholder='Briefly describe yourself, your experience, and your strengths...'
            value={selfDescription}
            onChange={(e) => setSelfDescription(e.target.value)}
          />
        </div>
        {error && <p className="form-error">{error}</p>}
        <button className='generate-btn' onClick={handleGenerateReport}>
          Generate Report
        </button>
      </div>
    </main>
  );
};

export default Home;
