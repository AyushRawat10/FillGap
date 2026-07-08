import React from "react";
import "../styles/Loader.css";

export default function Loader({ text = "Loading..." }) {
  return (
    <div className="cn-loader-wrap">
      <div className="cn-loader-ring">
        <div className="cn-loader-ring-inner" />
      </div>
      <p className="cn-loader-text">{text}</p>
    </div>
  );
}