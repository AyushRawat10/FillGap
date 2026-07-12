import React, { useEffect, useState } from "react";
import {
  Code2,
  MessageSquare,
  Map,
  Target,
  ShieldAlert,
  Database,
  Layers,
  CircleGauge,
  CheckCircle2,
  Circle,
  CircleDot,
  Code,
  Server,
  Cloud,
} from "lucide-react";
import "../styles/Report.css";
import { useInterview } from "../hooks/useInterview.hook.js";
import Loader from "../../auth/components/Loader.jsx";
import { useParams } from "react-router";

const sections = [
  { id: "match-score", label: "Match Score", icon: CircleGauge },
  { id: "skill-gap", label: "Skill Gap", icon: Layers },
  { id: "technical", label: "Technical Questions", icon: Code2 },
  { id: "behavioral", label: "Behavioral Questions", icon: MessageSquare },
];

const Report = () => {
  const {reportId} = useParams()
  const [activeSection, setActiveSection] = useState("match-score");
  const { loading, report, handleToGetReportById } = useInterview();
  console.log(report);

  useEffect(() => {
    if(reportId) {
      handleToGetReportById(reportId)
    }
  }, [reportId])

  if (loading || !report) {
    return <Loader text="Loading your report..." />;
  }

  const iconMap = {
    code: Code,
    server: Server,
    database: Database,
    cloud: Cloud,
    security: ShieldAlert,
  };

  const priorityMap = {
    HIGH: "fgir-priority-high",
    MEDIUM: "fgir-priority-medium",
    LOW: "fgir-priority-low",
  };

  return (
    <div className="fgir-dash-page">
      <div className="fgir-dash-body">
        {/* Sidebar */}
        <aside className="fgir-sidebar">
          <div className="fgir-sidebar-label">SECTIONS</div>
          <div className="fgir-sidebar-list">
            {sections.map((s) => {
              const Icon = s.icon;
              const active = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  className={`fgir-sidebar-item ${active ? "fgir-sidebar-item-active" : ""}`}
                  onClick={() => setActiveSection(s.id)}
                >
                  <Icon size={18} />
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Center content — only the active section renders */}
        <main className="fgir-content">
          {activeSection === "match-score" && (
            <div className="fgir-card">
              <h2 className="fgir-card-title">Match Score</h2>

              <div className="fgir-score-box-wrap">
                <div className="fgir-score-box">
                  <span className="fgir-score-value">
                    {report.matchScore.accuracy}
                    <span className="fgir-score-percent">%</span>
                  </span>
                  <span className="fgir-score-caption">ROLE FIT</span>
                </div>
              </div>

              <h3 className="fgir-score-heading">
                {report.matchScore.matchScoreTitle}
              </h3>
              <p className="fgir-score-desc">
                {report.matchScore.matchScoreDescription}
              </p>
            </div>
          )}

          {activeSection === "skill-gap" && (
            <div className="fgir-card">
              <h2 className="fgir-card-title">Skill Gaps</h2>

              <div className="fgir-gap-list">
                {report.skillGaps.map((gap, index) => {
                  const Icon = iconMap[gap.lucideIcon] ?? Target;
                  const priorityClass =
                    priorityMap[gap.severity] ?? "fgir-priority-medium";
                  return (
                    <div className="fgir-gap-row" key={index + 1}>
                      <div className="fgir-gap-left">
                        <div className="fgir-gap-icon">
                          <Icon size={20} />
                        </div>
                        <div>
                          <div className="fgir-gap-title">{gap.skill}</div>
                          <div className="fgir-gap-desc">{gap.description}</div>
                        </div>
                      </div>
                      <span className={`fgir-priority-badge ${priorityClass}`}>
                        {gap.severity}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeSection === "technical" && (
            <div className="fgir-card">
              <h2 className="fgir-card-title">Technical Questions</h2>
              <div className="fgir-question-list">
                {report.technicalQuestions.map((element, index) => (
                  <div className="fgir-question-card" key={index}>
                    <div className="fgir-question-header">
                      <span className="fgir-question-number">Q{index + 1}</span>
                      <p className="fgir-question-text">{element.question}</p>
                    </div>

                    <div className="fgir-question-intention">
                      <span className="fgir-question-label">
                        Why this is asked
                      </span>
                      <p>{element.intention}</p>
                    </div>

                    <div className="fgir-question-answer">
                      <span className="fgir-question-label">
                        Suggested Answer
                      </span>
                      <p>{element.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "behavioral" && (
            <div className="fgir-card">
              <h2 className="fgir-card-title">Behavioral Questions</h2>
              <div className="fgir-question-list">
                {report.behavioralQuestions.map((element, index) => (
                  <div className="fgir-question-card" key={index}>
                    <div className="fgir-question-header">
                      <span className="fgir-question-number">Q{index + 1}</span>
                      <p className="fgir-question-text">{element.question}</p>
                    </div>

                    <div className="fgir-question-intention">
                      <span className="fgir-question-label">
                        Why this is asked
                      </span>
                      <p>{element.intention}</p>
                    </div>

                    <div className="fgir-question-answer">
                      <span className="fgir-question-label">
                        Suggested Answer
                      </span>
                      <p>{element.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "full-roadmap" && (
            <div className="fgir-card">
              <h2 className="fgir-card-title">Full Roadmap</h2>

              <div className="fgir-full-roadmap-list">
                {report.roadmap.map((step, index) => (
                  <div className="fgir-full-roadmap-card" key={index}>
                    <div className="fgir-full-roadmap-day">Day {step.day}</div>
                    <div className="fgir-full-roadmap-body">
                      <h3 className="fgir-full-roadmap-topic">{step.topic}</h3>
                      <p className="fgir-full-roadmap-advice">{step.advice}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Right sidebar — compact roadmap path */}
        <aside className="fgir-reports">
          <div className="fgir-sidebar-label">ROADMAP</div>

          <div className="fgir-roadmap-path">
            {report.roadmap.map((step, index) => {
              const isLast = index === report.roadmap.length - 1;

              return (
                <div className="fgir-roadmap-step" key={index}>
                  <div className="fgir-roadmap-marker">
                    <CircleDot
                      size={18}
                      className={`fgir-roadmap-icon fgir-roadmap-icon-current`}
                    />
                    {!isLast && <div className="fgir-roadmap-line" />}
                  </div>
                  <span
                    className={`fgir-roadmap-title fgir-roadmap-title-current`}
                  >
                    {step.topic}
                  </span>
                </div>
              );
            })}
          </div>

          <button
            className="fgir-view-all-btn"
            onClick={() => setActiveSection("full-roadmap")}
          >
            <Map size={16} />
            View Full Roadmap
          </button>
        </aside>
      </div>
    </div>
  );
};

export default Report;
