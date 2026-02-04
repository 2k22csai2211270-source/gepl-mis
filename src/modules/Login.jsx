import { useState } from "react";
import { loginApi } from "../api/authApi";

export default function Login({ onLogin, onSignup }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!username || !password) {
      setError("Enter username and password");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await loginApi(username, password);

      // SAVE TOKEN
      localStorage.setItem("token", data.token);

      onLogin({
        userName: data.username,
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

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

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
