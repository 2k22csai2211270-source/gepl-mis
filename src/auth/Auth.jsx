import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState("login"); // login | signup

  return mode === "login" ? (
    <Login
      onLogin={onLogin}
      onSignup={() => setMode("signup")}
    />
  ) : (
    <Signup
      onBack={() => setMode("login")}
    />
  );
}
