import React from "react";
import { X, CheckCircle2, XCircle } from "lucide-react";
import "../styles/ConfirmationModal.css";

const ConfirmationModal = ({ status, message, onClose }) => {
  if (!status) return null;

  const isSuccess = status === "success";

  return (
    <div className="fgm-overlay" onClick={onClose}>
      <div className="fgm-card" onClick={(e) => e.stopPropagation()}>
        <button className="fgm-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        {isSuccess ? (
          <CheckCircle2 size={40} className="fgm-icon-success" />
        ) : (
          <XCircle size={40} className="fgm-icon-error" />
        )}

        <h3 className="fgm-title">
          {isSuccess ? "Email Sent" : "Something Went Wrong"}
        </h3>
        <p className="fgm-message">{message}</p>

        <button className="fgm-ok-btn" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
