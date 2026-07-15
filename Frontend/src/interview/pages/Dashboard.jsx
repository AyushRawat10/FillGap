import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  Briefcase,
  User,
  UploadCloud,
  AlertCircle,
  Sparkles,
  FileText,
  ChevronRight,
} from "lucide-react";
import "../styles/Dashboard.css";
import { useInterview } from "../hooks/useInterview.hook.js";
import Loader from "../../auth/components/Loader.jsx";
import AlertMessage from "../../auth/components/AlertMessage.jsx"

const Dashboard = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [error, setError] = useState("");

  const { loading, handleToGenerateInterviewReport } = useInterview();

  const navigate = useNavigate();

  const maxChars = 5000;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setResumeFile(file);
  };

  const handleSubmit = async () => {
    setError("");

    if (!jobDescription.trim()) {
      setError("Job description is required");
      return;
    }
    if (!resumeFile && !selfDescription.trim()) {
      setError("Provide a resume or a self description");
      return;
    }

    try {
      const data = await handleToGenerateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });
     
      navigate(`/interview/report/${data._id}`);
    } catch (err) {
      if (err?.response?.status === 429) {
        setError(
          "Our AI model is currently busy. Please wait a moment and try again.",
        );
      } else {
        setError(
          err?.response?.data?.message ||
            "Something went wrong. Please try again.",
        );
      }
    }
  };

  if (loading) {
    return <Loader text="Preparing your report..." />;
  }

  return (
    <div className="fgid-page">
      {/* Top bar */}

      <main className="fgid-main">
        {/* Heading */}
        <div className="fgid-heading">
          <h1>
            Create Your Custom <span className="fgid-red">Interview Plan</span>
          </h1>
          <p>
            Let our AI analyze the job requirements and your unique profile to
            build a winning strategy.
          </p>
        </div>

        {/* Form card */}
        <div className="fgid-card">
          <div className="fgid-card-grid">
            {/* Left: Job Descrfgidtion */}
            <div className="fgid-panel">
              <div className="fgid-panel-header">
                <div className="fgid-panel-title">
                  <Briefcase size={18} />
                  <span>Target Job Descrfgidtion</span>
                </div>
                <span className="fgid-badge fgid-badge-required">REQUIRED</span>
              </div>

              <textarea
                className="fgid-textarea"
                maxLength={maxChars}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder={`Paste the full job descrfgidtion here...\ne.g. "Senior Frontend Engineer at Google requires proficiency in React, TypeScrfgidt, and large-scale system design..."`}
              />
              <div className="fgid-char-count">
                {jobDescription.length} / {maxChars} chars
              </div>
            </div>

            {/* Right: Profile */}
            <div className="fgid-panel">
              <div className="fgid-panel-header">
                <div className="fgid-panel-title">
                  <User size={18} />
                  <span>Your Profile</span>
                </div>
              </div>

              <div className="fgid-subhead-row">
                <span className="fgid-subhead">Upload Resume</span>
                <span className="fgid-badge fgid-badge-muted">
                  BEST RESULTS
                </span>
              </div>

              <label className="fgid-dropzone">
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  hidden
                />
                <UploadCloud size={28} className="fgid-dropzone-icon" />
                <span className="fgid-dropzone-text">
                  {resumeFile
                    ? resumeFile.name
                    : "Click to upload or drag & drop"}
                </span>
                <span className="fgid-dropzone-sub">PDF or DOCX (Max 5MB)</span>
              </label>

              <div className="fgid-divider">
                <span>OR</span>
              </div>

              <div className="fgid-subhead-row">
                <span className="fgid-subhead">Quick Self-Descrfgidtion</span>
              </div>

              <textarea
                className="fgid-textarea fgid-textarea-short"
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
              />

              <div className="fgid-notice">
                <AlertCircle size={16} className="fgid-notice-icon" />
                <p>
                  Either a Resume or a Self Descrfgidtion is required to
                  generate a personalized plan.
                </p>
              </div>
            </div>
          </div>

          {/* Footer of card */}
          <div className="fgid-card-footer">
            <span className="fgid-footer-note">
              AI-Powered Strategy Generation - Approx 30s
            </span>
                <AlertMessage type="error" message={error} />
            <button className="fgid-analyze-btn" onClick={handleSubmit}>
              <Sparkles size={16} />
              Analyze Resume
            </button>
          </div>
        </div>

        {/* Previous Reports */}
      </main>
    </div>
  );
};

export default Dashboard;
