import { useState } from "react";

export default function TopBar({ user, onLogout }) {
  const [showProfile, setShowProfile] = useState(false);

  function toggleTheme() {
    document.body.classList.toggle("light");
  }

  return (
    <>
      {/* ================= TOP NAVBAR ================= */}
      <header className="topbar">
        <div className="topbar-left">
          <h1 className="brand-title">GEATPEC</h1><h1 className="brand-name">ELECTRONICS</h1>
        </div>

        <div className="topbar-actions">
          {/* THEME TOGGLE */}
          <button
            className="icon-btn"
            title="Toggle Theme"
            onClick={toggleTheme}
          >
            🌗
          </button>

          {/* USER PROFILE */}
          <button
            className="icon-btn"
            title="Profile"
            onClick={() => setShowProfile(true)}
          >
            👤
          </button>

          {/* LOGOUT */}
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* ================= USER PROFILE MODAL =================
      {showProfile && (
        <div className="modal">
          <div className="modal-card">
            <h3>User Profile</h3>

            <p>
              <b>Username:</b> {user?.username}
            </p>
            <p>
              <b>Role:</b> {user?.role}
            </p>

            <button onClick={() => setShowProfile(false)}>
              Close
            </button>
          </div>
        </div>
      )} */}
    </>
  );
}
