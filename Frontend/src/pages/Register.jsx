import React, { useState } from "react";
import { FileText, BarChart3, Eye, EyeOff } from "lucide-react";
import "../styles/Register.css";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="cn-page">
      {/* Nav */}
      <nav className="cn-nav">
        <div className="cn-logo">FILL GAP</div>
        
        <div className="cn-nav-actions">
          <a href="#" className="cn-signin-link">
            Sign In
          </a>
          <button className="cn-btn-primary">Back to Home</button>
        </div>
      </nav>

      {/* Main */}
      <main className="cn-main">
        {/* Left content */}
        <div className="cn-hero">
          <div className="cn-badge">
            <span className="cn-badge-dot" />
            NEXT-GEN INTELLIGENCE
          </div>

          <h1 className="cn-hero-title">
            <em>Fill</em> the <em>Gap</em> Between Your Resume and Your Dream Job.
            <br />
          </h1>

          <p className="cn-hero-text">
            Elevate your recruitment process with cinematic precision. Transform
            fragmented job descriptions and raw resumes into comprehensive,
            data-driven interview reports in seconds.
          </p>

          <div className="cn-features">
            <div className="cn-feature">
              <div className="cn-feature-icon">
                <FileText size={20} />
              </div>
              <div>
                <div className="cn-feature-title">Intelligent Report Generation</div>
                <div className="cn-feature-desc">
                  Transform resume and job description analysis into structured interview reports instantly.
                </div>
              </div>
            </div>

            <div className="cn-feature">
              <div className="cn-feature-icon">
                <BarChart3 size={20} />
              </div>
              <div>
                <div className="cn-feature-title">Automated Reporting</div>
                <div className="cn-feature-desc">
                  Instant generation of structured, high-fidelity interview
                  guides.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right form card */}
        <div className="cn-card">
          <h2 className="cn-card-title">Create Account</h2>
          <p className="cn-card-subtitle">
            Every Skill You Gain Helps Fill the Gap.
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="cn-form">
            <div className="cn-field">
              <label className="cn-label">FULL NAME</label>
              <div className="cn-input-wrap">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="AYUSH RAWAT"
                  className="cn-input"
                />
              </div>
            </div>

            <div className="cn-field">
              <label className="cn-label">EMAIL</label>
              <div className="cn-input-wrap">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="RAWAT@FILL-GAP.COM"
                  className="cn-input"
                />
              </div>
            </div>

            <div className="cn-field">
              <label className="cn-label">PASSWORD</label>
              <div className="cn-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="cn-input"
                />
                <button
                  type="button"
                  className="cn-eye-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="cn-submit-btn">
              REGISTER
            </button>
          </form>

          <p className="cn-footer-text">
            Do you have an account?{" "}
            <a href="#" className="cn-inline-link">
              Login
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="cn-footer">
        <div>
          <div className="cn-logo">FILL GAP</div>
          <p className="cn-footer-tagline">
            Forging the next generation of high-
            <br />
            performance recruitment technology.
          </p>
        </div>

        <div className="cn-footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>

        <p className="cn-copyright">
          © 2024 Fill Gap. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Register;
