import { useEffect, useState } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Pie, Line } from "react-chartjs-2";

import {
  getDashboardSummary,
  getProjectDashboard
} from "../services/dashboardService";

import { getInventory } from "../services/inventoryService";

/* ================= JWT USER ================= */
function decodeToken() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

/* ================= FORMATTER ================= */
const money = n =>
  Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2
  });

export default function Dashboard({ onLogout, cashData }) {

  /* ================= USER ================= */
  const [loggedUser, setLoggedUser] = useState(null);

  useEffect(() => {
    setLoggedUser(decodeToken());
  }, []);

  /* ================= SUMMARY ================= */
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    loadSummary();
  }, []);

  async function loadSummary() {
    try {
      const res = await getDashboardSummary();
      setSummary(res);
    } catch {
      console.log("Summary load failed");
    }
  }

  /* ================= INVENTORY ================= */
  const [inventoryData, setInventoryData] = useState([]);

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    try {
      const res = await getInventory(0, 100);
      setInventoryData(res.content || []);
    } catch {
      console.log("Inventory load failed");
    }
  }

  /* ================= CASH ================= */
  const cashFinal =
    cashData?.length
      ? cashData
      : JSON.parse(localStorage.getItem("cashData")) || [];

  /* ================= PROJECT DASHBOARD ================= */
  const [projectId, setProjectId] = useState("");
  const [projectData, setProjectData] = useState(null);
  const [showProjectPage, setShowProjectPage] = useState(false);

  async function openProjectDashboard() {
    if (!projectId) return alert("Enter Project ID");
    try {
      const res = await getProjectDashboard(projectId);
      setProjectData(res);
      setShowProjectPage(true);
      document.body.style.overflow = "hidden";
    } catch {
      alert("Invalid Project ID");
    }
  }

  function closeProjectDashboard() {
    setShowProjectPage(false);
    document.body.style.overflow = "auto";
  }

  const [showProfile, setShowProfile] = useState(false);

  if (!summary) return "Loading...";

  /* ========================================================= */
  /* ================= PROJECT DASHBOARD PAGE ================= */
  /* ========================================================= */
  if (showProjectPage && projectData) {
    return (
      <div className="project-fullscreen">

        <h1 style={{ marginBottom: 24 }}>📊 Project Dashboard</h1>

        {/* ===== KPIs ===== */}
        <div className="kpi-grid">
          <div className="card kpi"><span>🆔 ID</span><b>{projectData.projectId}</b></div>
          <div className="card kpi"><span>🏷 Code</span><b>{projectData.projectCode}</b></div>
          <div className="card kpi"><span>💰 Budget</span><b>₹ {money(projectData.plannedBudget)}</b></div>
          <div className="card kpi payables"><span>💸 Spend</span><b>₹ {money(projectData.actualSpend)}</b></div>
          <div className="card kpi"><span>📊 Used</span><b>{projectData.budgetUtilizationPercent}%</b></div>
          <div className="card kpi"><span>📥 Cash In</span><b>₹ {money(projectData.cashIn)}</b></div>
          <div className="card kpi"><span>📤 Cash Out</span><b>₹ {money(projectData.cashOut)}</b></div>
          <div className="card kpi receivables"><span>📥 Receivables</span><b>₹ {money(projectData.receivableOutstanding)}</b></div>
          <div className="card kpi payables"><span>📤 Payables</span><b>₹ {money(projectData.payableOutstanding)}</b></div>
          <div className="card kpi inventory"><span>📦 Inventory</span><b>{projectData.inventoryConsumed}</b></div>

          <div className="card kpi">
            <span>💵 Cost</span>
            <b style={{ color: projectData.costStatus === "OVER_BUDGET" ? "red" : "limegreen" }}>
              {projectData.costStatus}
            </b>
          </div>

          <div className="card kpi">
            <span>🌊 Flow</span>
            <b style={{ color: projectData.cashFlowStatus === "NEGATIVE" ? "red" : "limegreen" }}>
              {projectData.cashFlowStatus}
            </b>
          </div>

          <div className="card kpi">
            <span>⚠ Risk</span>
            <b style={{
              color:
                projectData.receivableRisk === "HIGH"
                  ? "red"
                  : projectData.receivableRisk === "MEDIUM"
                    ? "orange"
                    : "limegreen"
            }}>
              {projectData.receivableRisk}
            </b>
          </div>
        </div>

        {/* ===== PROJECT CHARTS ===== */}
        <div className="chart-grid" style={{ marginTop: 32 }}>

          <div className="card">
            <h3>Cash In vs Cash Out</h3>
            <Bar
              data={{
                labels: ["Cash In", "Cash Out"],
                datasets: [
                  {
                    label: "Cash In",
                    data: [projectData.cashIn, 0],
                    backgroundColor: "#22c55e"
                  },
                  {
                    label: "Cash Out",
                    data: [0, projectData.cashOut],
                    backgroundColor: "#ef4444"
                  }
                ]
              }}
            />
          </div>

          <div className="card">
            <h3>Budget vs Actual Spend</h3>
            <Bar
              data={{
                labels: ["Planned Budget", "Actual Spend"],
                datasets: [
                  {
                    label: "Planned Budget",
                    data: [projectData.plannedBudget, 0],
                    backgroundColor: "#38bdf8"
                  },
                  {
                    label: "Actual Spend",
                    data: [0, projectData.actualSpend],
                    backgroundColor: "#f97316"
                  }
                ]
              }}
            />
          </div>

          <div className="card">
            <h3>Receivable vs Payable</h3>
            <Bar
              data={{
                labels: ["Receivables", "Payables"],
                datasets: [
                  {
                    label: "Receivables",
                    data: [projectData.receivableOutstanding, 0],
                    backgroundColor: "#0ea5e9"
                  },
                  {
                    label: "Payables",
                    data: [0, projectData.payableOutstanding],
                    backgroundColor: "#dc2626"
                  }
                ]
              }}
            />
          </div>

        </div>

        <button style={{ marginTop: 32, width: "100%" }} onClick={closeProjectDashboard}>
          Close
        </button>
      </div>
    );
  }

  /* ========================================================= */
  /* ================= EXECUTIVE DASHBOARD =================== */
  /* ========================================================= */
  return (
    <div>

      <div className="dash-header">
        <div>
          <h1>Executive Dashboard</h1>
          <p>Welcome Back, <b>{loggedUser?.username || loggedUser?.sub}</b></p>
        </div>

        <div className="dash-actions">
          <button className="icon-btn" onClick={() => document.body.classList.toggle("light")}>🌗</button>
          <button className="icon-btn" onClick={() => setShowProfile(true)}>👤</button>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </div>

      <div className="card">
        <h3>Open Project Dashboard</h3>
        <input value={projectId} onChange={e => setProjectId(e.target.value)} />
        <button onClick={openProjectDashboard}>Open</button>
      </div>

      <div className="kpi-grid">
        <div className="card kpi"><span>💰 Cash</span><b>₹ {money(summary.netCashPosition)}</b></div>
        <div className="card kpi receivables"><span>📥 Receivables</span><b>₹ {money(summary.totalReceivableOutstanding)}</b></div>
        <div className="card kpi payables"><span>📤 Payables</span><b>₹ {money(summary.totalPayableOutstanding)}</b></div>
        <div className="card kpi"><span>📁 Total Projects</span><b>{summary.totalProjects}</b></div>
        <div className="card kpi"><span>🚀 Active Projects</span><b>{summary.activeProjects}</b></div>
        <div className="card kpi"><span>📥 Cash In</span><b>₹ {money(summary.totalCashIn)}</b></div>
        <div className="card kpi"><span>📤 Cash Out</span><b>₹ {money(summary.totalCashOut)}</b></div>
        <div className="card kpi"><span>❤️ Cash Health</span><b>{summary.cashHealth}</b></div>
      </div>

      <div className="chart-grid">
        <div className="card">
          <h3>Receivable vs Payable</h3>
          <Bar
            data={{
              labels: ["Receivables", "Payables"],
              datasets: [
                {
                  label: "Receivables",
                  data: [summary.totalReceivableOutstanding, 0],
                  backgroundColor: "#38bdf8"
                },
                {
                  label: "Payables",
                  data: [0, summary.totalPayableOutstanding],
                  backgroundColor: "#ef4444"
                }
              ]
            }}
          />
        </div>

        <div className="card">
          <h3>Inventory Distribution</h3>
          <Pie
            data={{
              labels: inventoryData.map(i => i.itemName),
              datasets: [{
                data: inventoryData.map(i => Number(i.quantity || 0)),
                backgroundColor: [
                  "#22c55e", "#f59e0b", "#38bdf8",
                  "#ef4444", "#a855f7", "#14b8a6"
                ]
              }]
            }}
          />
        </div>
      </div>

      <div className="card">
        <h3>Cash Flow Trend</h3>
        <Line
          data={{
            labels: cashFinal.map((_, i) => `Txn ${i + 1}`),
            datasets: [{
              label: "Cash Flow",
              data: cashFinal.reduce((arr, c, i) => {
                const prev = arr[i - 1] || 0;
                const amt = Number(c.amount || 0);
                arr.push(prev + (String(c.type).toLowerCase() === "out" ? -amt : amt));
                return arr;
              }, []),
              borderColor: "#38bdf8",
              backgroundColor: "rgba(56,189,248,0.25)",
              fill: true
            }]
          }}
        />
      </div>

      {showProfile && loggedUser && (
        <div className="modal">
          <div className="modal-card">
            <h3>User Profile</h3>
            <p><b>Name:</b> {loggedUser.username || loggedUser.sub}</p>
            <p><b>Role:</b> {loggedUser.role}</p>
            <button onClick={() => setShowProfile(false)}>Close</button>
          </div>
        </div>
      )}

    </div>
  );
}
