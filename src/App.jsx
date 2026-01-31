import { useState } from "react";

/* AUTH */
import Login from "./modules/Login";
import Signup from "./modules/Signup";

/* LAYOUT */
import Sidebar from "./layout/Sidebar";

/* PAGES */
import Dashboard from "./dashboards/Dashboard";
import CashBank from "./modules/CashBank";
import Receivables from "./modules/Receivables";
import Payables from "./modules/Payables";
import Inventory from "./modules/Inventory";
import Production from "./modules/Production";
import Procurement from "./modules/Procurement";
import Projects from "./modules/Projects";
import VendorScorecard from "./modules/VendorScorecard";

export default function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [page, setPage] = useState("dashboard");

  /* ================= LOGOUT ================= */
  function logout() {
    setUser(null);
    setPage("dashboard");
  }

  /* ================= AUTH SCREENS ================= */
  if (!user) {
    return showSignup ? (
      <Signup onBack={() => setShowSignup(false)} />
    ) : (
      <Login
        onLogin={u => {
          setUser(u);
          setPage("dashboard");
        }}
        onSignup={() => setShowSignup(true)}
      />
    );
  }

  /* ================= PAGE SWITCH ================= */
  let content;

  switch (page) {
    case "cash":
      content = <CashBank user={user} />;
      break;

    case "receivables":
      content = <Receivables />;
      break;

    case "payables":
      content = <Payables />;
      break;

    case "inventory":
      content = <Inventory />;
      break;

    case "production":
      content = <Production />;
      break;

    case "procurement":
      content = <Procurement />;
      break;

    case "projects":
      content = <Projects />;
      break;

    case "vendor-scorecard":
      content = <VendorScorecard />;
      break;

    default:
      content = (
        <Dashboard
          user={user}
          onLogout={logout}
        />
      );
  }

  /* ================= LAYOUT ================= */
  return (
    <div className="app-shell">
      <Sidebar
        user={user}
        page={page}
        setPage={setPage}
      />

      <main className="content page-transition">
        {content}
      </main>
    </div>
  );
}
