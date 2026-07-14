import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import "../styles/Login.css";
import { useAuth } from "../hooks/useAuth.hook.js";
import Loader from "../components/Loader.jsx";
import AlertMessage from "../components/AlertMessage.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const { loading, handleLogin } = useAuth();

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

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

    setError("");

    try {
      const success = await handleLogin({ email, password });

      if (success) {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
      err?.response?.data?.message || "Login failed. Please try again.",
    );
    }

  };

  if (loading) {
    return <Loader text="Unlocking your account..." />;
  }

  return (
    <div className="fgl-page">
      {/* Nav */}
      <nav className="fgl-nav">
        <div className="fgl-logo">FILL GAP</div>

        <div className="fgl-nav-actions">
          <Link to="/register" className="fgl-signin-link">
            Sign Up
          </Link>
          <Link to="/">
            <button className="fgl-btn-primary">Back to Home</button>
          </Link>
        </div>
      </nav>

      {/* Main */}
      <main className="fgl-main">
        <div className="fgl-card">
          <h1 className="fgl-title">Login</h1>
          <p className="fgl-subtitle">
            Log in to continue generating professional
            <br />
            interview reports.
          </p>

          <form onSubmit={handleSubmit} className="fgl-form">
            <div className="fgl-field">
              <label className="fgl-label">EMAIL ADDRESS</label>
              <div className="fgl-input-wrap">
                <Mail size={18} className="fgl-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@fill-gap.com"
                  className="fgl-input"
                />
              </div>
              {errors.email && <p className="text-red-500">{errors.email}</p>}
            </div>

            <div className="fgl-field">
              <div className="fgl-label-row">
                <label className="fgl-label">PASSWORD</label>
                <Link to="/forgot-password" className="fgl-forgot-link">
                  Forgot Password?
                </Link>
              </div>
              <div className="fgl-input-wrap">
                <Lock size={18} className="fgl-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="fgl-input"
                />
                <button
                  type="button"
                  className="fgl-eye-btn"
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
            <AlertMessage type="error" message={error} />
            <button type="submit" className="fgl-signin-btn">
              SIGN IN
            </button>
          </form>

          <p className="fgl-signup-text">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="fgl-signup-link">
              Register
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="fgl-footer">
        <div className="fgl-logo">FILL GAP</div>
        <div className="fgl-footer-right">
          <div className="fgl-footer-links">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <p className="fgl-copyright">© 2024 FillGap. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
