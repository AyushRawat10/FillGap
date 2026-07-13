import React, { useEffect, useState } from "react";
import { FileText, ChevronRight } from "lucide-react";
import { useInterview } from "../hooks/useInterview.hook.js";
import { useNavigate } from "react-router";

const previousReports = [
  {
    id: 1,
    title: "Senior Frontend Engineer @ Google",
    date: "Analyzed on Oct 24, 2023",
    score: 92,
  },
  {
    id: 2,
    title: "Product Designer @ Meta",
    date: "Analyzed on Oct 20, 2023",
    score: 78,
  },
  {
    id: 3,
    title: "Full Stack Developer @ Strfgice",
    date: "Analyzed on Oct 15, 2023",
    score: 85,
  },
];

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
