import React from "react";
import { useNavigate } from "react-router-dom";

export default function Hello() {
  const navigate = useNavigate();

  return (
    <div className="hello-page">
      <div className="hello-container">
        <h1>Welcome to FarmChainX</h1>
        <p>AI-Driven Agricultural Traceability Network</p>
        <button className="primary-btn" onClick={() => navigate("/login")}>
          Login
        </button>
      </div>
    </div>
  );
}
