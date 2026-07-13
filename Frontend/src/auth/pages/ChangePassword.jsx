import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth.hook.js";
import "../styles/ChangePassword.css";
import AlertMessage from "../components/AlertMessage.jsx";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { handleChangeCurrentPassword, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      await handleChangeCurrentPassword({ oldPassword, newPassword });
      setSuccess("Password changed successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="fgcp-page">
      <div className="fgcp-card">
        <div className="fgcp-header">
          <Lock size={20} />
          <h2>Change Password</h2>
        </div>
        <p className="fgcp-subtext">
          Update your account password. You'll need your current password to confirm.
        </p>

        <form onSubmit={handleSubmit} className="fgcp-form">
          <div className="fgcp-field">
            <label>Current Password</label>
            <div className="fgcp-input-wrap">
              <input
                type={showOld ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter current password"
              />
              <button
                type="button"
                className="fgcp-eye-btn"
                onClick={() => setShowOld((prev) => !prev)}
              >
                {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="fgcp-field">
            <label>New Password</label>
            <div className="fgcp-input-wrap">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
              <button
                type="button"
                className="fgcp-eye-btn"
                onClick={() => setShowNew((prev) => !prev)}
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="fgcp-field">
            <label>Confirm New Password</label>
            <input
              type={showNew ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
            />
          </div>

          <AlertMessage type="error" message={error} />
          <AlertMessage type="success" message={success} />

          <button type="submit" className="fgcp-submit-btn" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;