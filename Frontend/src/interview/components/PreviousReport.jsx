import React, { useEffect, useState } from "react";
import { FileText, ChevronRight } from "lucide-react";
import { useInterview } from "../hooks/useInterview.hook.js";
import { useNavigate } from "react-router";


const PreviousReport = () => {
  const { loading, allReports, hadleToGetAllReports } = useInterview();
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    hadleToGetAllReports();
  }, []);

  if (loading) {
    return null;
  }

  if(!allReports || allReports.length === 0) {
    return null;
  }

  const visibleReports = showAll ? allReports ?? [] : allReports?.slice(0, 3) ?? []

  return (
    <>
      <div className="fgic-footer-body">
        <div className="fgic-reports-header">
          <h2>Previous Reports</h2>
          <button className="fgic-view-all"
          onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? "Show Less" : "View All History"}
          </button>
        </div>

        <div className="fgic-reports-list">
          {visibleReports.map((report) => (
            <div className="fgic-report-row" key={report._id}
            onClick={() => navigate(`/interview/report/${report._id}`)}
            >
              <div className="fgic-report-left">
                <div className="fgic-report-icon">
                  <FileText size={18} />
                </div>
                <div>
                  <div className="fgic-report-title">{report.title}</div>
                  <div className="fgic-report-date">
                    Analyzed on{" "}
                    {new Date(report.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>

              <div className="fgic-report-right">
                <div className="fgic-report-score">
                  <span className="fgic-score-label">MATCH SCORE</span>
                  <span className="fgic-score-value">
                    {report.matchScore?.accuracy ?? "N/A"}%
                  </span>
                </div>
                <ChevronRight size={18} className="fgic-chevron" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PreviousReport;
