import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="fg-page">
      {/* Nav */}
      <nav className="fg-nav">
        <div className="fg-logo">FILL GAP</div>

        <div className="fg-nav-actions">
          <a href="#" className="fg-signin-link">
            Sign Up
          </a>
          <button className="fg-btn-primary">Back to Home</button>
        </div>
      </nav>

      {/* Main */}
      <main className="fg-main">
        <div className="fg-card">
          <h1 className="fg-title">Login</h1>
          <p className="fg-subtitle">
            Log in to continue generating professional
            <br />
            interview reports.
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="fg-form">
            <div className="fg-field">
              <label className="fg-label">EMAIL ADDRESS</label>
              <div className="fg-input-wrap">
                <Mail size={18} className="fg-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@fill-gap.com"
                  className="fg-input"
                />
              </div>
            </div>

            <div className="fg-field">
              <div className="fg-label-row">
                <label className="fg-label">PASSWORD</label>
                <a href="#" className="fg-forgot-link">
                  Forgot Password?
                </a>
              </div>
              <div className="fg-input-wrap">
                <Lock size={18} className="fg-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="fg-input"
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

            <button type="submit" className="fg-signin-btn">
              SIGN IN
            </button>
          </form>

          <p className="fg-signup-text">
            Don&apos;t have an account?{" "}
            <a href="#" className="fg-signup-link">
              Register
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="fg-footer">
        <div className="fg-logo">FILL GAP</div>
        <div className="fg-footer-right">
          <div className="fg-footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
          <p className="fg-copyright">© 2024 FillGap. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
