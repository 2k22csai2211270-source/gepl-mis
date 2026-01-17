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
import { generateAlerts } from "../utils/alerts";

/* ================= CHART REGISTRATION ================= */
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

/* ================= ANIMATED NUMBER HOOK ================= */
function useAnimatedNumber(value) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    let start = display;
    let end = value;
    let startTime = null;

    function animate(time) {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / 600, 1);
      setDisplay(Math.floor(start + (end - start) * progress));
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [value]);

  return display;
}

export default function Dashboard({
  user,
  onLogout,
  cashData = [],
  receivables = [],
  payables = [],
  inventory = [],
  production = []
}) {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  /* ================= KPI CALCULATIONS ================= */
  const cashBalance = cashData.reduce(
    (s, c) => s + (c.type === "in" ? c.amount : -c.amount),
    0
  );
  const totalReceivables = receivables.reduce((s, r) => s + r.amount, 0);
  const totalPayables = payables.reduce((s, p) => s + p.amount, 0);

  const cashAnim = useAnimatedNumber(cashBalance);
  const recAnim = useAnimatedNumber(totalReceivables);
  const payAnim = useAnimatedNumber(totalPayables);
  const invAnim = useAnimatedNumber(inventory.length);

  const trend = v => (v > 0 ? "up" : v < 0 ? "down" : "same");

  /* ================= ALERTS ================= */
  const alerts = generateAlerts({
    receivables,
    payables,
    inventory,
    production
  });

  /* ================= CHART DATA ================= */

  /* BAR */
  const barData = {
    labels: ["Receivables", "Payables"],
    datasets: [
      {
        label: "Amount (₹)",
        data: [totalReceivables, totalPayables],
        backgroundColor: ["#38bdf8", "#ef4444"],
        borderRadius: 10
      }
    ]
  };

  const barOptions = {
    animation: {
      duration: 900,
      easing: "easeOutQuart"
    },
    plugins: {
      legend: { display: false }
    }
  };

  /* PIE */
  const pieData = {
    labels: inventory.map(i => i.name),
    datasets: [
      {
        data: inventory.map(i => i.qty),
        backgroundColor: ["#22c55e", "#f59e0b", "#38bdf8", "#ef4444"]
      }
    ]
  };

  const pieOptions = {
    animation: {
      animateRotate: true,
      duration: 900,
      easing: "easeOutCubic"
    }
  };

  /* LINE – CASH FLOW */
  const lineData = {
    labels: cashData.map((_, i) => `Txn ${i + 1}`),
    datasets: [
      {
        label: "Cash Flow (₹)",
        data: cashData.reduce((arr, c, i) => {
          const prev = arr[i - 1] || 0;
          arr.push(prev + (c.type === "in" ? c.amount : -c.amount));
          return arr;
        }, []),
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56,189,248,0.25)",
        tension: 0.4,
        fill: true,
        pointRadius: 4
      }
    ]
  };

  const lineOptions = {
    animation: {
      duration: 1200,
      easing: "easeOutQuart"
    }
  };

  return (
    <div>
      {/* ================= HEADER ================= */}
      <div className="dash-header">
        <div>
          <h1>Executive Dashboard</h1>
          <p>Welcome back, <b>{user.username}</b></p>
        </div>

        <div className="dash-actions">
          <button className="icon-btn" onClick={() => document.body.classList.toggle("light")}>🌗</button>

          <button className="icon-btn" onClick={() => setShowNotif(!showNotif)}>
            🔔 {alerts.length > 0 && <span className="badge">{alerts.length}</span>}
          </button>

          <button className="icon-btn" onClick={() => setShowProfile(true)}>👤</button>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>

        {showNotif && (
          <div className="notif-panel">
            {alerts.map((a, i) => (
              <div key={i} className="notif-item">{a}</div>
            ))}
          </div>
        )}
      </div>

      {/* ================= KPI GRID ================= */}
      <div className="kpi-grid">
        <div className="card kpi cash">
          <span>💰 Cash</span>
          <b>₹ {cashAnim}</b>
          <i className={trend(cashBalance)}>▲</i>
        </div>

        <div className="card kpi receivables">
          <span>📥 Receivables</span>
          <b>₹ {recAnim}</b>
          <i className={trend(totalReceivables)}>▲</i>
        </div>

        <div className="card kpi payables">
          <span>📤 Payables</span>
          <b>₹ {payAnim}</b>
          <i className={trend(totalPayables)}>▲</i>
        </div>

        <div className="card kpi inventory">
          <span>📦 Inventory</span>
          <b>{invAnim}</b>
          <i className={trend(inventory.length)}>▲</i>
        </div>
      </div>

      {/* ================= CHARTS ================= */}
      <div className="chart-grid">
        <div className="card">
          <h3>Receivables vs Payables</h3>
          <Bar data={barData} options={barOptions} />
        </div>

        <div className="card">
          <h3>Inventory Distribution</h3>
          {inventory.length ? <Pie data={pieData} options={pieOptions} /> : "No inventory data"}
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h3>Cash Flow Trend</h3>
        {cashData.length ? <Line data={lineData} options={lineOptions} /> : "No cash transactions"}
      </div>

      {/* ================= PROFILE MODAL ================= */}
      {showProfile && (
        <div className="modal">
          <div className="modal-card">
            <h3>User Profile</h3>
            <p><b>Username:</b> {user.username}</p>
            <p><b>Role:</b> {user.role}</p>
            <button onClick={() => setShowProfile(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
