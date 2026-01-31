import { useEffect, useState } from "react";
import { getDashboardSummary } from "../services/dashboardService";

const BASE_URL = "https://sparkling-radiance-production-a273.up.railway.app";

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : ""
  };
}

const money = n =>
  Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2
  });

export default function Dashboard({ user, onLogout }) {

  /* ================= MAIN DASHBOARD ================= */
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    loadSummary();
  }, []);

  async function loadSummary() {
    const res = await getDashboardSummary();
    setSummary(res);
  }

  /* ================= PROFILE MODAL ================= */
  const [showProfile, setShowProfile] = useState(false);

  /* ================= PROJECT DASHBOARD ================= */
  const [projectId, setProjectId] = useState("");
  const [projectData, setProjectData] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);

  async function openProjectDashboard() {
    if (!projectId) return alert("Enter Project ID");

    try {
      const res = await fetch(
        `${BASE_URL}/api/kpi/projects/${projectId}`,
        { headers: authHeaders() }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();
      setProjectData(data);
      setShowProjectModal(true);

    } catch {
      alert("Invalid Project ID");
    }
  }

  if (!summary) return "Loading...";

  return (
    <div>

      {/* ================= HEADER ================= */}
      <div className="dash-header">
        <div>
          <h1>Executive Dashboard</h1>
          <p>Welcome, <b>{user.username}</b></p>
        </div>

        <div className="dash-actions">
          {/* 🌗 THEME TOGGLE */}
          <button
            className="icon-btn"
            onClick={() => document.body.classList.toggle("light")}
          >
            🌗
          </button>

          {/* 👤 PROFILE BUTTON */}
          <button
            className="icon-btn"
            onClick={() => setShowProfile(true)}
          >
            👤
          </button>

          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>


      {/* ================= KPI GRID ================= */}
      <div className="kpi-grid">
        <div className="card kpi">
          <span>💰 Cash</span>
          <b>₹ {money(summary.netCashPosition)}</b>
        </div>

        <div className="card kpi receivables">
          <span>📥 Receivables</span>
          <b>₹ {money(summary.totalReceivableOutstanding)}</b>
        </div>

        <div className="card kpi payables">
          <span>📤 Payables</span>
          <b>₹ {money(summary.totalPayableOutstanding)}</b>
        </div>
        <div className="card kpi inventory">
          <span>📊 Projects</span>
          <b>{summary.totalProjects}</b>
        </div>

        <div className="card kpi inventory">
          <span>🚀 Active</span>
          <b>{summary.activeProjects}</b>
        </div>


        <div className="card kpi">
          <span>📥 Cash In</span>
          <b>₹ {money(summary.totalCashIn)}</b>
        </div>

        <div className="card kpi">
          <span>📤 Cash Out</span>
          <b>₹ {money(summary.totalCashOut)}</b>
        </div>


        <div className="card kpi payables">
          <span>❤️ Cash Health</span>
          <b>{summary.cashHealth}</b>
        </div>

      </div>

      {/* ================= PROJECT ID FORM ================= */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3>Open Project Dashboard</h3>

        <input
          placeholder="Enter Project ID"
          value={projectId}
          onChange={e => setProjectId(e.target.value)}
        />

        <button onClick={openProjectDashboard}>
          Open
        </button>
      </div>
      {/* ================= PROJECT DASHBOARD MODAL ================= */}
      {showProjectModal && projectData && (
        <div className="modal">
          <div className="modal-card">

            <h2>Project Dashboard</h2>

            <div className="kpi-grid">

              <div className="card kpi inventory">
                <span>🆔 Project ID</span>
                <b>{projectData.projectId}</b>
              </div>

              <div className="card kpi inventory">
                <span>🏷 Project Code</span>
                <b>{projectData.projectCode}</b>
              </div>

              <div className="card kpi">
                <span>💰 Planned Budget</span>
                <b>₹ {money(projectData.plannedBudget)}</b>
              </div>

              <div className="card kpi">
                <span>💸 Actual Spend</span>
                <b>₹ {money(projectData.actualSpend)}</b>
              </div>

              <div className="card kpi">
                <span>📊 Budget Used</span>
                <b>{projectData.budgetUtilizationPercent}%</b>
              </div>

              <div className="card kpi">
                <span>📥 Cash In</span>
                <b>₹ {money(projectData.cashIn)}</b>
              </div>

              <div className="card kpi">
                <span>📤 Cash Out</span>
                <b>₹ {money(projectData.cashOut)}</b>
              </div>

              <div className="card kpi receivables">
                <span>📥 Receivables</span>
                <b>₹ {money(projectData.receivableOutstanding)}</b>
              </div>

              <div className="card kpi payables">
                <span>📤 Payables</span>
                <b>₹ {money(projectData.payableOutstanding)}</b>
              </div>

              <div className="card kpi inventory">
                <span>📦 Inventory Used</span>
                <b>{projectData.inventoryConsumed}</b>
              </div>

              <div className="card kpi">
                <span>💵 Cost Status</span>
                <b>{projectData.costStatus}</b>
              </div>

              <div className="card kpi">
                <span>🌊 Cash Flow</span>
                <b>{projectData.cashFlowStatus}</b>
              </div>

              <div className="card kpi receivables">
                <span>⚠ Receivable Risk</span>
                <b>{projectData.receivableRisk}</b>
              </div>

            </div>

            <button
              style={{ marginTop: 20 }}
              onClick={() => setShowProjectModal(false)}
            >
              Close
            </button>

          </div>
        </div>
      )}


      {/* ================= PROFILE MODAL ================= */}
      {showProfile && (
        <div className="modal">
          <div className="modal-card">
            <h3>User Profile</h3>
            <p><b>Username:</b> {user.username}</p>
            <p><b>Role:</b> {user.role}</p>

            <button onClick={() => setShowProfile(false)}>
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
