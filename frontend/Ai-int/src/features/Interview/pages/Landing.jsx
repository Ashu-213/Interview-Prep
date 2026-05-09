import { Link } from 'react-router';
import '../style/landing.scss';

const METRICS = [
  { value: '3',    label: 'Focused sections' },
  { value: '7d',   label: 'Prep plan'         },
  { value: '100%', label: 'Private sessions'  },
];

const FEATURES = [
  { label: 'Questions', title: 'Technical & behavioral prompts'  },
  { label: 'Roadmap',   title: '7-day preparation plan'         },
  { label: 'Insights',  title: 'Match score and skill gaps'      },
];

const Landing = () => (
  <main className="landing-page">
    <section className="landing-hero">

      {/* ── Left: copy ── */}
      <div className="hero-copy">
        <span className="hero-kicker">Interview Prep Platform</span>

        <h1>Turn your resume into a focused interview roadmap</h1>

        <p>
          Upload a resume, paste a job description — get tailored questions,
          skill gaps, and a 7-day plan that's clean and easy to act on.
        </p>

        <div className="hero-actions">
          <Link to="/register" className="hero-btn primary">Start for free</Link>
        </div>

        <div className="hero-metrics">
          {METRICS.map(({ value, label }) => (
            <div key={label} className="metric-item">
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right: feature panel ── */}
      <div className="hero-panel">
        <div className="panel-glow" aria-hidden="true" />

        <div className="feature-card feature-main">
          <span className="feature-label">Core Flow</span>
          <h2>Resume → AI analysis → Interview confidence</h2>
          <p>
            Your dashboard organises everything into a score, skill gaps,
            targeted questions, and a day-by-day roadmap.
          </p>
        </div>

        <div className="feature-grid">
          {FEATURES.map(({ label, title }) => (
            <article key={label} className="feature-card">
              <span className="feature-label">{label}</span>
              <h3>{title}</h3>
            </article>
          ))}
        </div>
      </div>

    </section>
  </main>
);

export default Landing;