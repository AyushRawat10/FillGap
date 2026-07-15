import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { FileText, BarChart3, Eye, EyeOff } from "lucide-react";
import "../styles/Register.css";
import { useAuth } from "../hooks/useAuth.hook.js";
import Loader from "../components/Loader.jsx";
import ConfirmationModal from "../components/ConfirmationModal.jsx";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modal, setModal] = useState({ status: null, message: ""})
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { loading, handleRegister } = useAuth();

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;

    if (!username.trim()) {
      newErrors.username = "Username is required !";
    } else if (!usernameRegex.test(username)) {
      newErrors.username =
        "Username must start with a letter and be 3-20 characters !";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = "Email is required !";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address !";
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!password) {
      newErrors.password = "Password is required !";
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character !";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await handleRegister({ username, email, password });
      setModal({
        status: "success",
        message: "Registration successful! A verification email has been sent. Redirecting to login..."
      })
      setTimeout(() => navigate("/login"), 3000)
    } catch (err) {
      setModal({
        status: "error",
        message: err?.response?.data?.message || "Registration failed. Please try again."
      })
    }
  };

  const closeModal = () => setModal({ status: null, message: "" });

  if (loading) {
    return <Loader text="Creating your account..." />;
  }

  return (
    <>
    <div className="fgr-page">
      {/* Nav */}
      <nav className="fgr-nav">
        <div className="fgr-logo">FILL GAP</div>

        <div className="fgr-nav-actions">
          <Link to="/login" className="fgr-signin-link">
            Sign In
          </Link>
          <Link to="/">
            <button className="fgr-btn-primary">Back to Home</button>
          </Link>
        </div>
      </nav>

      {/* Main */}
      <main className="fgr-main">
        {/* Left content */}
        <div className="fgr-hero">
          <div className="fgr-badge">
            <span className="fgr-badge-dot" />
            NEXT-GEN INTELLIGENCE
          </div>

          <h1 className="fgr-hero-title">
            <em>Fill</em> the <em>Gap</em> Today. Shape Tomorrow.
            <br />
          </h1>

          <p className="fgr-hero-text">
            Elevate your recruitment process with cinematic precision. Transform
            fragmented job descriptions and raw resumes into comprehensive,
            data-driven interview reports in seconds.
          </p>

          <div className="fgr-features">
            <div className="fgr-feature">
              <div className="fgr-feature-icon">
                <FileText size={20} />
              </div>
              <div>
                <div className="fgr-feature-title">
                  Intelligent Report Generation
                </div>
                <div className="fgr-feature-desc">
                  Transform resume and job description analysis into structured
                  interview reports instantly.
                </div>
              </div>
            </div>

            <div className="fgr-feature">
              <div className="fgr-feature-icon">
                <BarChart3 size={20} />
              </div>
              <div>
                <div className="fgr-feature-title">Automated Reporting</div>
                <div className="fgr-feature-desc">
                  Instant generation of structured, high-fidelity interview
                  guides.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right form card */}
        <div className="fgr-card">
          <h2 className="fgr-card-title">Create Account</h2>
          <p className="fgr-card-subtitle">
            Every Skill You Gain Helps Fill the Gap.
          </p>

          <form onSubmit={handleSubmit} className="fgr-form">
            <div className="fgr-field">
              <label className="fgr-label">FULL NAME</label>
              <div className="fgr-input-wrap">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="AYUSH RAWAT"
                  className="fgr-input"
                />
              </div>
              {errors.username && (
                <p className="text-red-500">{errors.username}</p>
              )}
            </div>

            <div className="fgr-field">
              <label className="fgr-label">EMAIL</label>
              <div className="fgr-input-wrap">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="RAWAT@FILL-GAP.COM"
                  className="fgr-input"
                />
              </div>
              {errors.email && <p className="text-red-500">{errors.email}</p>}
            </div>

            <div className="fgr-field">
              <label className="fgr-label">PASSWORD</label>
              <div className="fgr-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="fgr-input"
                />
                <button
                  type="button"
                  className="fgr-eye-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500">{errors.password}</p>
              )}
            </div>
              
            <button
              type="submit"
              className="fgr-submit-btn"
            >
              REGISTER
            </button>
          </form>

          <p className="fgr-footer-text">
            Do you have an account?{" "}
            <Link to="/login" className="fgr-inline-link">
              Login
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="fgr-footer">
        <div>
          <div className="fgr-logo">FILL GAP</div>
          <p className="fgr-footer-tagline">
            Forging the next generation of high-
            <br />
            performance recruitment technology.
          </p>
        </div>

        <div className="fgr-footer-links">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <p className="fgr-copyright">© 2024 Fill Gap. All rights reserved.</p>
      </footer>
    </div>
    <ConfirmationModal
      status={modal.status}
      message={modal.message}
      onClose={closeModal}
    />
    </>
  );
};

export default Register;
