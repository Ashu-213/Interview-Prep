import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useInterview } from '../hooks/useInterview';
import '../style/interview.scss';

const severityColor = { low: 'severity-low', medium: 'severity-medium', high: 'severity-high' };

const ScoreRing = ({ score }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? '#4ade80' : score >= 45 ? '#facc15' : '#f87171';

  return (
    <div className="score-ring-wrap">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#1e2440" strokeWidth="12" />
        <circle
          cx="70" cy="70" r={radius} fill="none"
          stroke={color} strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="score-label">
        <span className="score-number" style={{ color }}>{score}</span>
        <span className="score-sub">/ 100</span>
      </div>
    </div>
  );
};

const Accordion = ({ items, type }) => {
  const [open, setOpen] = useState(null);
  const toggle = (i) => setOpen(open === i ? null : i);

  return (
    <div className="accordion">
      {items.map((item, i) => (
        <div key={i} className={`accordion-item ${open === i ? 'open' : ''}`}>
          <button className="accordion-header" onClick={() => toggle(i)}>
            <span className="q-number">{type === 'technical' ? 'T' : 'B'}{i + 1}</span>
            <span className="q-text">{item.question}</span>
            <span className="chevron">{open === i ? '▲' : '▼'}</span>
          </button>
          {open === i && (
            <div className="accordion-body">
              <div className="detail-block intent">
                <span className="detail-label">Interviewer's Intent</span>
                <p>{item.intentions}</p>
              </div>
              <div className="detail-block answer">
                <span className="detail-label">How to Answer</span>
                <p>{item.answer}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const Interview = () => {
  const { interviewId } = useParams();
  const { loading, report, fetchReportById } = useInterview();
  const navigate = useNavigate();

  useEffect(() => {
    if (interviewId) {
      fetchReportById(interviewId);
    }
  }, [interviewId]);

  if (loading) {
    return (
      <main className="loading-screen">
        <div className="loader-content">
          <div className="spinner" />
          <h2>Loading your report...</h2>
        </div>
      </main>
    );
  }

  if (!report) {
    return (
      <main className="loading-screen">
        <div className="loader-content">
          <h2>Report not found.</h2>
          <button className="back-btn" onClick={() => navigate('/')}>← Go Back</button>
        </div>
      </main>
    );
  }

  return (
    <main className="interview-page">

      {/* ── Header ── */}
      <div className="report-header">
        <button className="back-btn" onClick={() => navigate('/')}>← New Report</button>
        <div className="header-text">
          <h1>{report.title}</h1>
          <p className="report-date">
            Generated on {new Date(report.createdAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* ── 3-Column Layout ── */}
      <div className="dashboard-grid">
        
        {/* ── LEFT: Preparation Plan ── */}
        <div className="column column-left">
          <section className="report-section">
            <div className="section-header">
              <span className="section-icon">📅</span>
              <div>
                <h2>7-Day Plan</h2>
                <p className="section-sub">Your roadmap to success</p>
              </div>
            </div>
            <div className="prep-plan">
              {report.preparationPlan?.map((dayPlan, i) => (
                <div key={i} className="day-card">
                  <div className="day-badge">Day {dayPlan.day}</div>
                  <div className="day-content">
                    <h3 className="day-focus">{dayPlan.focus}</h3>
                    <ul className="day-tasks">
                      {dayPlan.tasks.map((task, j) => (
                        <li key={j}>{task}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── MIDDLE: Questions ── */}
        <div className="column column-middle">
          
          {/* Technical Questions */}
          <section className="report-section">
            <div className="section-header">
              <span className="section-icon">⚙️</span>
              <div>
                <h2>Technical</h2>
                <p className="section-sub">{report.technicalQuestions?.length} questions</p>
              </div>
            </div>
            <Accordion items={report.technicalQuestions || []} type="technical" />
          </section>

          {/* Behavioral Questions */}
          <section className="report-section">
            <div className="section-header">
              <span className="section-icon">🧠</span>
              <div>
                <h2>Behavioral</h2>
                <p className="section-sub">{report.behavioralQuestions?.length} questions</p>
              </div>
            </div>
            <Accordion items={report.behavioralQuestions || []} type="behavioral" />
          </section>

        </div>

        {/* ── RIGHT: Score & Skill Gaps ── */}
        <div className="column column-right">
          
          {/* Score Card */}
          <section className="report-section score-section">
            <div className="score-card">
              <ScoreRing score={report.overallScore} />
              <div className="score-info">
                <h2>Match Score</h2>
                <p>
                  {report.overallScore >= 70
                    ? 'Strong match! Your profile aligns well with this role.'
                    : report.overallScore >= 45
                    ? 'Moderate match. Focus on gaps below.'
                    : 'Low match. Upskill in identified areas.'}
                </p>
              </div>
            </div>
          </section>

          {/* Skill Gaps */}
          <section className="report-section">
            <div className="section-header">
              <span className="section-icon">📊</span>
              <div>
                <h2>Skill Gaps</h2>
                <p className="section-sub">Areas to strengthen</p>
              </div>
            </div>
            <div className="skill-gaps-grid">
              {report.skillGaps?.map((gap, i) => (
                <div key={i} className="skill-gap-card">
                  <div className="skill-gap-top">
                    <span className="skill-name">{gap.skill}</span>
                    <span className={`severity-badge ${severityColor[gap.severity]}`}>
                      {gap.severity}
                    </span>
                  </div>
                  <p className="gap-description">{gap.gap}</p>
                </div>
              ))}
            </div>
          </section>

        </div>

      </div>

    </main>
  );
};

export default Interview;
