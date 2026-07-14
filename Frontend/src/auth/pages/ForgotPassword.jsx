import React, { useState } from "react";
import { Link } from "react-router";
import { Mail, ArrowLeft } from "lucide-react";
import "../styles/Login.css";
import { useAuth } from "../hooks/useAuth.hook.js";
import Loader from "../components/Loader.jsx";
import AlertMessage from "../components/AlertMessage.jsx";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { loading, handleForgotPassword } = useAuth();

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateEmail()) return;

    try {
      await handleForgotPassword({ email });
      setSuccess(
        "If an account exists with this email, a reset link has been sent.",
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    }
  };

  if (loading) {
    return <Loader text="Sending reset link..." />;
  }
  return (
    <div className="fgl-page">
      <nav className="fgl-nav">
        <div className="fgl-logo">FILL GAP</div>
        <div className="fgl-nav-actions">
          <Link to="/login" className="fgl-signin-link">
            Back to Login
          </Link>
        </div>
      </nav>

      <main className="fgl-main">
        <div className="fgl-card">
          <Link to="/login" className="fgl-back-link">
            <ArrowLeft size={16} />
            Back
          </Link>

          <h1 className="fgl-title">Forgot Password?</h1>
          <p className="fgl-subtitle">
            Enter the email associated with your account and we'll
            <br />
            send you a link to reset your password.
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
            </div>

            <AlertMessage type="error" message={error} />
            <AlertMessage type="success" message={success} />

            <button type="submit" className="fgl-signin-btn">
              SEND RESET LINK
            </button>
          </form>

          <p className="fgl-signup-text">
            Remember your password?{" "}
            <Link to="/login" className="fgl-signup-link">
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
