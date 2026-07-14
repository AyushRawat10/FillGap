import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { Lock, Eye, EyeOff } from "lucide-react";
import "../styles/Login.css";
import { useAuth } from "../hooks/useAuth.hook.js";
import Loader from "../components/Loader.jsx";
import AlertMessage from "../components/AlertMessage.jsx";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { loading, handleResetPasswordVerification } = useAuth();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  const validateForm = () => {
    if (!newPassword) {
      setError("New password is required");
      return false;
    }
    if (!passwordRegex.test(newPassword)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      );
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    try {
      await handleResetPasswordVerification({token, newPassword});
      setSuccess("Password reset successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Reset link is invalid or has expired.",
      );
    }
  };

  if (loading) {
    return <Loader text="Resetting your password..." />;
  }

  return (
    <div className="fgl-page">
      <nav className="fgl-nav">
        <div className="fgl-logo">FILL GAP</div>
        <div className="fgl-nav-actions">
          <Link to="/login" className="fgl-signin-link">Back to Login</Link>
        </div>
      </nav>

      <main className="fgl-main">
        <div className="fgl-card">
          <h1 className="fgl-title">Reset Password</h1>
          <p className="fgl-subtitle">
            Enter a new password for your account.
          </p>

          <form onSubmit={handleSubmit} className="fgl-form">
            <div className="fgl-field">
              <label className="fgl-label">NEW PASSWORD</label>
              <div className="fgl-input-wrap">
                <Lock size={18} className="fgl-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
            </div>

            <div className="fgl-field">
              <label className="fgl-label">CONFIRM NEW PASSWORD</label>
              <div className="fgl-input-wrap">
                <Lock size={18} className="fgl-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="fgl-input"
                />
              </div>
            </div>

            <AlertMessage type="error" message={error} />
            <AlertMessage type="success" message={success} />

            <button type="submit" className="fgl-signin-btn">
              RESET PASSWORD
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;
