import { useState } from "react";

export default function TopBar({ user, onLogout }) {
  function toggleTheme() {
    document.body.classList.toggle("light");
  }

  const initial = (user?.username || "U")[0].toUpperCase();

  return (
    <header className="topbar">

      {/* LEFT: brand block — same width as sidebar */}
      <div className="topbar-left">
        <div className="brand-container">
          <div className="brand-logo">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path d="M4 12h4l2-6 4 12 2-6h4"
                stroke="currentColor" strokeWidth="2.3" fill="none"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-main">GEATPEC</span>
            <span className="brand-sub">Electronics Pvt. Ltd.</span>
          </div>
        </div>
      </div>

      {/* RIGHT: actions */}
      <div className="topbar-actions">

        {/* User chip */}
        {user && (
          <div className="user-pill">
            <div style={{
              width: 24, height: 24, borderRadius: "50%",
              background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
              color: "white", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0
            }}>
              {initial}
            </div>
            <span style={{ maxWidth: 88, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13 }}>
              {user.username}
            </span>
            <span style={{
              fontSize: 9.5, fontWeight: 700, padding: "1px 7px", borderRadius: 99,
              background: "var(--primary-soft)", color: "var(--primary)",
              letterSpacing: "0.5px", textTransform: "uppercase"
            }}>
              {user.role}
            </span>
          </div>
        )}

        {/* Theme toggle */}
        <button className="icon-btn" title="Toggle Theme" onClick={toggleTheme}>
          🌗
        </button>

        {/* Logout */}
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
