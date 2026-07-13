import React from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";
import "../styles/AlertMessage.css";

const iconMap = {
  error: XCircle,
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
};

const AlertMessage = ({ type = "error", message }) => {
  if (!message) return null;

  const Icon = iconMap[type] ?? Info;

  return (
    <div className={`fga-alert fga-alert-${type}`}>
      <Icon size={18} className="fga-alert-icon" />
      <span>{message}</span>
    </div>
  );
};

export default AlertMessage;