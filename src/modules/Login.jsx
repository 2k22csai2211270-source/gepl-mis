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

      onLogin({
        username: data.username,
        role: data.role,
        token: data.token
      });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>MIS Login</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        {/* PASSWORD FIELD */}
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ paddingRight: "44px" }}
          />

          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "12px",
              top: "45%",
              transform: "translateY(-50%)",
              cursor: "pointer"
            }}
          >
            {showPassword ? (
              /* EYE OFF */
              <svg
                width="15"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5.05 0-9.27-3.11-11-8 1.21-3.06 3.56-5.4 6.42-6.61" />
                <path d="M1 1l22 22" />
                <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c5.05 0 9.27 3.11 11 8a10.97 10.97 0 0 1-4.17 5.12" />
              </svg>
            ) : (
              /* EYE */
              <svg
                width="15"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </span>
        </div>

        {error && <p className="error-text">{error}</p>}

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
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
