import React from "react";
import { FileText, ChevronRight } from "lucide-react";

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
  return (
    <>
    <div className="fgic-footer-body">
      <div className="fgic-reports-header">
        <h2>Previous Reports</h2>
        <a href="#" className="fgic-view-all">
          View All History
        </a>
      </div>

      <div className="fgic-reports-list">
        {previousReports.map((report) => (
          <div className="fgic-report-row" key={report.id}>
            <div className="fgic-report-left">
              <div className="fgic-report-icon">
                <FileText size={18} />
              </div>
              <div>
                <div className="fgic-report-title">{report.title}</div>
                <div className="fgic-report-date">{report.date}</div>
              </div>
            </div>

            <div className="fgic-report-right">
              <div className="fgic-report-score">
                <span className="fgic-score-label">MATCH SCORE</span>
                <span className="fgic-score-value">{report.score}%</span>
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
