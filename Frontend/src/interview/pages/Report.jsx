import React, { useState } from "react";
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
} from "lucide-react";
import "../styles/Report.css";

const sections = [
  { id: "match-score", label: "Match Score", icon: CircleGauge },
  { id: "skill-gap", label: "Skill Gap", icon: Layers },
  { id: "technical", label: "Technical Questions", icon: Code2 },
  { id: "behavioral", label: "Behavioral Questions", icon: MessageSquare },
];

const skillGaps = [
  {
    id: 1,
    icon: Target,
    title: "Microservices Architecture",
    desc: "Identified during System Design interview",
    priority: "HIGH PRIORITY",
    priorityClass: "fgir-priority-high",
  },
  {
    id: 2,
    icon: ShieldAlert,
    title: "OAuth 2.0 / OpenID Connect",
    desc: "Gap noted in Security module",
    priority: "MEDIUM",
    priorityClass: "fgir-priority-medium",
  },
  {
    id: 3,
    icon: Database,
    title: "NoSQL Aggregation Pipelines",
    desc: "Based on your Technical Q1 performance",
    priority: "MEDIUM",
    priorityClass: "fgir-priority-medium",
  },
];

const roadmapSteps = [
  { id: 1, title: "Core Fundamentals", status: "done" },
  { id: 2, title: "System Design Basics", status: "done" },
  { id: 3, title: "Microservices Architecture", status: "current" },
  { id: 4, title: "Security & OAuth", status: "upcoming" },
  { id: 5, title: "Mock Interview Round", status: "upcoming" },
];

const Report = () => {
  const [activeSection, setActiveSection] = useState("match-score");

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
                    85<span className="fgir-score-percent">%</span>
                  </span>
                  <span className="fgir-score-caption">ROLE FIT</span>
                </div>
              </div>

              <h3 className="fgir-score-heading">Strong Alignment</h3>
              <p className="fgir-score-desc">
                Your profile shows strong alignment with Senior Backend
                Developer roles. Improving system design depth could
                increase your score to 92%.
              </p>
            </div>
          )}

          {activeSection === "skill-gap" && (
            <div className="fgir-card">
              <h2 className="fgir-card-title">Skill Gaps</h2>

              <div className="fgir-gap-list">
                {skillGaps.map((gap) => {
                  const Icon = gap.icon;
                  return (
                    <div className="fgir-gap-row" key={gap.id}>
                      <div className="fgir-gap-left">
                        <div className="fgir-gap-icon">
                          <Icon size={20} />
                        </div>
                        <div>
                          <div className="fgir-gap-title">{gap.title}</div>
                          <div className="fgir-gap-desc">{gap.desc}</div>
                        </div>
                      </div>
                      <span className={`fgir-priority-badge ${gap.priorityClass}`}>
                        {gap.priority}
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
              <p className="fgir-score-desc" style={{ margin: 0, textAlign: "left" }}>
                Your technical interview questions will appear here.
              </p>
            </div>
          )}

          {activeSection === "behavioral" && (
            <div className="fgir-card">
              <h2 className="fgir-card-title">Behavioral Questions</h2>
              <p className="fgir-score-desc" style={{ margin: 0, textAlign: "left" }}>
                Your behavioral interview questions will appear here.
              </p>
            </div>
          )}
        </main>

        {/* Right sidebar — compact roadmap path */}
        <aside className="fgir-reports">
          <div className="fgir-sidebar-label">ROADMAP</div>

          <div className="fgir-roadmap-path">
            {roadmapSteps.map((step, index) => {
              const isLast = index === roadmapSteps.length - 1;
              const StatusIcon =
                step.status === "done"
                  ? CheckCircle2
                  : step.status === "current"
                  ? CircleDot
                  : Circle;

              return (
                <div className="fgir-roadmap-step" key={step.id}>
                  <div className="fgir-roadmap-marker">
                    <StatusIcon
                      size={18}
                      className={`fgir-roadmap-icon fgir-roadmap-icon-${step.status}`}
                    />
                    {!isLast && <div className="fgir-roadmap-line" />}
                  </div>
                  <span
                    className={`fgir-roadmap-title fgir-roadmap-title-${step.status}`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>

          <button className="fgir-view-all-btn">
            <Map size={16} />
            View Full Roadmap
          </button>
        </aside>
      </div>
    </div>
  );
};

export default Report;