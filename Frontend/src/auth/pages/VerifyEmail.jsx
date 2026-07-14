import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { CheckCircle2, XCircle } from "lucide-react";
import "../styles/Login.css";
import { useAuth } from "../hooks/useAuth.hook.js";
import Loader from "../components/Loader.jsx";
import AlertMessage from "../components/AlertMessage.jsx";

const VerifyEmail = () => {
  const { token } = useParams();
  const { handleEmailVerification } = useAuth();

  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [error, setError] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        await handleEmailVerification({ token });
        setStatus("success");
      } catch (err) {
        setError(err?.response?.data?.message || "Verification link is invalid or has expired.");
        setStatus("error");
      }
    };

    verify();
  }, [token]);

  if (status === "verifying") {
    return <Loader text="Verifying your email..." />;
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
        <div className="fgl-card fgl-card-center">
          {status === "success" ? (
            <>
              <CheckCircle2 size={48} className="fgl-verify-icon-success" />
              <h1 className="fgl-title">Email Verified</h1>
              <p className="fgl-subtitle">
                Your email has been successfully verified. You can now log in.
              </p>
              <Link to="/login">
                <button className="fgl-signin-btn" style={{ marginTop: 16 }}>
                  GO TO LOGIN
                </button>
              </Link>
            </>
          ) : (
            <>
              <XCircle size={48} className="fgl-verify-icon-error" />
              <h1 className="fgl-title">Verification Failed</h1>
              <AlertMessage type="error" message={error} />
              <p className="fgl-subtitle" style={{ marginTop: 16 }}>
                The link may have expired. Log in and request a new verification email.
              </p>
              <Link to="/login">
                <button className="fgl-signin-btn" style={{ marginTop: 16 }}>
                  GO TO LOGIN
                </button>
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default VerifyEmail;