import { useState } from "react";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const USERS = {
    admin: { password: "admin123", role: "admin" },
    finance: { password: "fin123", role: "finance" },
    production: { password: "prod123", role: "production" },
    purchase: { password: "pur123", role: "purchase" }
  };

  function handleLogin() {
    const user = USERS[username];
    if (!user || user.password !== password) {
      setError("Invalid username or password");
      return;
    }
    onLogin({ username, role: user.role });
  }

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "radial-gradient(circle at top,#020617,#000)"
    }}>
      <div className="card" style={{ width: 380 }}>
        <h2>GEPL MIS</h2>
        <p style={{ color: "var(--text-muted)" }}>
          Secure enterprise access
        </p>

        <input
          placeholder="Username"
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}
