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

      await signupApi({
        username,
        password,
        role
      });

      setSuccess("Account created successfully. Please login.");
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
        <h2>Create Account</h2>

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

        {/* ROLE SELECT ONLY IN SIGNUP */}
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="ACCOUNTS">Accounts</option>
          <option value="PRODUCTION">Production</option>
          <option value="PURCHASE">Purchase</option>
          <option value="FOUNDER">Founder</option>
        </select>

        <button onClick={handleSignup} disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        <button className="link-btn" onClick={onBack}>
          Back to Login
        </button>
      </div>
    </div>
  );
}
