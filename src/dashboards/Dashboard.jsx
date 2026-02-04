import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

import { Bar, Pie, Line } from "react-chartjs-2";

import {
  getDashboardSummary,
  getProjectDashboard
} from "../services/dashboardService";

import { getInventory } from "../services/inventoryService";

/* ================= CHART SETUP ================= */
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

/* ================= JWT USER ================= */
function decodeToken() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
}

/* ================= FORMATTER ================= */
const money = n =>
  Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2
  });

/* ================= SAFE ROLE DISPLAY ================= */
function getRole(role) {
  if (!role) return "N/A";

  // If role is object → take name
  if (typeof role === "object") {
    return role.name || role.role || "N/A";
  }

  return role;
}

export default function Dashboard({ onLogout, cashData }) {
  /* ================= USER ================= */
  const [loggedUser, setLoggedUser] = useState(null);

  useEffect(() => {
    setLoggedUser(decodeToken());
  }, []);

  /* ================= SUMMARY ================= */
  const [summary, setSummary] = useState(null);

  async function loadSummary() {
    try {
      const res = await getDashboardSummary();

      // Some APIs return {data: {...}}
      const actualSummary = res?.data || res;

      setSummary(actualSummary);
    } catch (err) {
      console.log("Summary load failed:", err);
    }
  }

  useEffect(() => {
    loadSummary();
  }, []);

  /* ================= INVENTORY ================= */
  const [inventoryData, setInventoryData] = useState([]);

  async function loadInventory() {
    try {
      const res = await getInventory(0, 100);

      setInventoryData(res?.content || []);
    } catch (err) {
      console.log("Inventory load failed:", err);
    }
  }

  useEffect(() => {
    loadInventory();
  }, []);

  /* ================= CASH ================= */
  const cashFinal =
    cashData?.length
      ? cashData
      : JSON.parse(localStorage.getItem("cashData")) || [];

  /* ================= LOADING ================= */
  if (!summary) {
    return (
      <div style={{ padding: 30 }}>
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  /* ================= CHART DATA ================= */
  const barData = {
    labels: ["Receivables", "Payables"],
    datasets: [
      {
        label: "Receivables",
        data: [summary.totalReceivableOutstanding || 0, 0]
      },
      {
        label: "Payables",
        data: [0, summary.totalPayableOutstanding || 0]
      }
    ]
  };

  const pieData = {
    labels: inventoryData.map(i => i.itemName || "Unknown"),
    datasets: [
      {
        data: inventoryData.map(i => Number(i.quantity || 0))
      }
    ]
  };

  const lineData = {
    labels: cashFinal.map((_, i) => `Txn ${i + 1}`),
    datasets: [
      {
        label: "Cash Flow",
        data: cashFinal.reduce((arr, c, i) => {
          const prev = arr[i - 1] || 0;
          const amt = Number(c.amount || 0);

          arr.push(
            prev +
              (String(c.type).toLowerCase() === "out" ? -amt : amt)
          );

          return arr;
        }, [])
      }
    ]
  };

  /* ================= PROFILE MODAL ================= */
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div>
      {/* ================= HEADER ================= */}
      <div className="dash-header">
        <div>
          <h1>Executive Dashboard</h1>

          <p>
            Welcome Back,{" "}
            <b>
              {loggedUser?.username ||
                loggedUser?.sub ||
                "User"}
            </b>
          </p>
        </div>

        <div className="dash-actions">
          <button
            className="icon-btn"
            onClick={() =>
              document.body.classList.toggle("light")
            }
          >
            🌗
          </button>

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

      {/* ================= KPIs ================= */}
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

        <div className="card kpi">
          <span>📁 Total Projects</span>
          <b>{summary.totalProjects || 0}</b>
        </div>

        <div className="card kpi">
          <span>❤️ Cash Health</span>
          <b>
            {typeof summary.cashHealth === "object"
              ? summary.cashHealth.status
              : summary.cashHealth}
          </b>
        </div>
      </div>

      {/* ================= CHARTS ================= */}
      <div className="chart-grid">
        <div className="card">
          <h3>Receivable vs Payable</h3>
          <Bar data={barData} />
        </div>

        <div className="card">
          <h3>Inventory Distribution</h3>
          <Pie data={pieData} />
        </div>
      </div>

      <div className="card">
        <h3>Cash Flow Trend</h3>
        <Line data={lineData} />
      </div>

      {/* ================= PROFILE ================= */}
      {showProfile && loggedUser && (
        <div className="modal">
          <div className="modal-card">
            <h3>User Profile</h3>

            <p>
              <b>Name:</b>{" "}
              {loggedUser.username || loggedUser.sub}
            </p>

            <p>
              <b>Role:</b> {getRole(loggedUser.role)}
            </p>

            <button onClick={() => setShowProfile(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}