import React, { useState, useRef, useEffect, useContext } from "react";
import {
  ChevronDown,
  Home,
  LayoutDashboard,
  KeyRound,
  LogOut,
  MailCheck,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth.hook.js";
import { AuthContext } from "../../auth/context/AuthContext.jsx";
import ConfirmationModal from "../../auth/components/ConfirmationModal.jsx";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState({ status: null, message: "" });
  const [resendLoading, setResendLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { handleLogout, loading, handleResendEmailVerification } = useAuth();
  const context = useContext(AuthContext);
  const { setUser, user } = context;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResendVerificationClick = async () => {
    setResendLoading(true);
    try {
      await handleResendEmailVerification();
      setModal({
        status: "success",
        message: "Verification email sent. Please check your inbox.",
      });
    } catch (err) {
      setModal({
        status: "error",
        message:
          err?.response?.data?.message ||
          "Failed to resend verification email.",
      });
    } finally {
      setResendLoading(false);
    }
  };

  const closeModal = () => setModal({ status: null, message: "" });

  const handleLogoutClick = async () => {
    try {
      await handleLogout();
    } catch (error) {
      console.log("Logout error : ", error);
    } finally {
      setUser(null);
      navigate("/");
    }
  };

  return (
    <>
      <nav className="fgic-dash-nav">
        <div className="fgic-dash-left">
          <span className="fgic-dash-logo">FILL GAP</span>
        </div>

        <div className="fgic-dash-right" ref={dropdownRef}>
          <button
            className="fgic-toggle-btn"
            onClick={() => setOpen((v) => !v)}
          >
            Menu
            <ChevronDown
              size={16}
              className={`fgic-toggle-icon ${open ? "fgic-toggle-icon-open" : ""}`}
            />
          </button>

          {open && (
            <div className="fgic-dropdown">
              <div className="fgic-dropdown-item" onClick={() => navigate("/")}>
                <Home size={16} />
                Home
              </div>
              <div
                className="fgic-dropdown-item"
                onClick={() => navigate("/dashboard")}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </div>
              <div
                className="fgic-dropdown-item"
                onClick={() => navigate("/change-password")}
              >
                <KeyRound size={16} />
                Change Password
              </div>
              {!user?.isEmailVerified && (
                <div
                  className={`fgic-dropdown-item ${resendLoading ? "fgic-dropdown-item-disabled" : ""}`}
                  onClick={resendLoading ? undefined : handleResendVerificationClick}
                >
                  <MailCheck size={16} />
                  {resendLoading ? "Sending..." : "Resend Verification Email"}
                </div>
              )}
              <div
                className="fgic-dropdown-danger-item"
                onClick={handleLogoutClick}
              >
                <LogOut size={16} />
                Logout
              </div>
            </div>
          )}
        </div>
      </nav>
      <ConfirmationModal
        status={modal.status}
        message={modal.message}
        onClose={closeModal}
      />
    </>
  );
};

export default Navbar;
