import { useState } from "react";
import { signupApi } from "../api/authApi";

export default function Signup({ onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ACCOUNTS");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSignup() {
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      await signupApi({ username, password, role });
      setSuccess("Account created successfully. Please sign in.");
      setUsername("");
      setPassword("");
      setRole("ACCOUNTS");
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">

        {/* Logo */}
        <div className="auth-logo-area">
          <div className="auth-logo">
            <svg viewBox="0 0 24 24" width="26" height="26">
              <path
                d="M4 12h4l2-6 4 12 2-6h4"
                stroke="currentColor"
                strokeWidth="2.2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <h2>Create Account</h2>
        <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)", marginBottom: 24, marginTop: 4 }}>
          Register a new GEATPEC MIS user
        </p>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", marginBottom: 5 }}>
            Username
          </label>
          <input
            placeholder="Choose a username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ marginBottom: 0 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", marginBottom: 5 }}>
            Password
          </label>
          <input
            type="password"
            placeholder="Choose a password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ marginBottom: 0 }}
          />
        </div>

        <div style={{ marginBottom: 4 }}>
          <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", marginBottom: 5 }}>
            Role
          </label>
          <select value={role} onChange={e => setRole(e.target.value)} style={{ marginBottom: 0 }}>
            <option value="ACCOUNTS">Accounts</option>
            <option value="PRODUCTION">Production</option>
            <option value="PROCUREMENT">Procurement</option>
            <option value="FOUNDER">Founder</option>
            <option value="PROJECT">Project</option>
          </select>
        </div>

        {error   && <p className="error-text"   style={{ marginBottom: 6 }}>{error}</p>}
        {success && <p className="success-text" style={{ marginBottom: 6 }}>{success}</p>}

        <button onClick={handleSignup} disabled={loading} style={{ width: "100%", height: 42, fontSize: 14, marginTop: 12 }}>
          {loading ? "Creating..." : "Create Account"}
        </button>

        <button className="link-btn" onClick={onBack} style={{ marginTop: 10 }}>
          ← Back to Sign In
        </button>
      </div>
    </div>
  );
}
