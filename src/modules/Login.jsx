import { useState } from "react";
import { loginApi } from "../api/authApi";

export default function Login({ onLogin, onSignup }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    if (!username || !password) {
      setError("Enter username and password");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const data = await loginApi(username, password);
      localStorage.setItem("token", data.token);
      onLogin({ username: data.username, role: data.role, token: data.token });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleLogin();
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

        <h2>Welcome back</h2>
        <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)", marginBottom: 24, marginTop: 4 }}>
          Sign in to GEATPEC MIS
        </p>

        {/* Username */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", marginBottom: 5 }}>
            Username
          </label>
          <input
            placeholder="Enter your username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ marginBottom: 0 }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 4 }}>
          <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", marginBottom: 5 }}>
            Password
          </label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5.05 0-9.27-3.11-11-8 1.21-3.06 3.56-5.4 6.42-6.61" />
                  <path d="M1 1l22 22" />
                  <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c5.05 0 9.27 3.11 11 8a10.97 10.97 0 0 1-4.17 5.12" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </span>
          </div>
        </div>

        {error && <p className="error-text" style={{ marginBottom: 8 }}>{error}</p>}

        <button onClick={handleLogin} disabled={loading} style={{ width: "100%", height: 42, fontSize: 14, marginTop: 12 }}>
          {loading ? "Signing in..." : "Sign In to MIS"}
        </button>

        <p className="auth-footer">
          New user?{" "}
          <span className="link" onClick={onSignup}>
            Create account
          </span>
        </p>
      </div>
    </div>
  );
}
