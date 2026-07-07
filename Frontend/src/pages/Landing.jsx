import React from "react";
import { useNavigate, Link } from "react-router";
import { Rocket, ArrowRight, Globe, Share2 } from "lucide-react";
import "../styles/Landing.css";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="fgland-page">
      {/* Nav */}
      <nav className="fgland-nav">
        <div className="fgland-logo">FILL GAP</div>

        <div className="fgland-nav-actions">
          <Link to="/api/v1/auth/login">
            <button className="fgland-btn-outline">Login</button>
          </Link>
          <Link to="/api/v1/auth/register">
            <button className="fgland-btn-primary">Sign Up</button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="fgland-hero">
        <div className="fgland-badge">
          <Rocket size={14} />
          BETA ACCESS NOW OPEN
        </div>

        <h1 className="fgland-title">
          <span className="fgland-title-red">
            <em>Fill</em>
          </span>{" "}
          the{" "}
          <span className="fgland-title-red">
            <em>Gap</em>
          </span>{" "}
          Between Your Resume and Your Dream Job.
          <br />
        </h1>

        <p className="fgland-subtitle">
          Instantly create personalized interview guides based on resume and job
          description analysis, and get hired faster through an immersive
          learning ecosystem built for high-performance professionals.
        </p>

        <div className="fgland-cta-row">
          <button
            className="fgland-cta-primary"
            onClick={() => navigate("/api/v1/auth/register")}
          >
            Start Your First Mission
            <ArrowRight size={18} />
          </button>
          <button className="fgland-cta-secondary">Documentation</button>
        </div>
      </main>

      {/* Footer */}
      <footer className="fgland-footer">
        <div>
          <div className="fgland-logo">FILL GAP</div>
          <p className="fgland-footer-tagline">
            Forging the next generation of high-
            <br />
            performance recruitment technology.
          </p>
        </div>

        <div className="fgland-footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>

        <p className="fgland-copyright">
          © 2024 Fill Gap. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
