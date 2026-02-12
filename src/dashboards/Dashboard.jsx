import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import {
  getDashboardSummary,
  getProjectDashboard,
  getUsers,
  getAuditLogs,
  resetUserPassword
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
  /* ================= PROJECT DASHBOARD ===================== */
  /* ========================================================= */
  if (showProjectPage && projectData) {
    return (
      <div className="project-fullscreen">
        <h1>📊 Project Dashboard</h1>

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

        <button
          style={{ marginTop: 32, width: "100%" }}
          onClick={closeProjectDashboard}
        >
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

      {/* ================= HEADER ================= */}
      <div className="dash-header">
        <div>
          <h1>Executive Dashboard</h1>
          <p>Welcome Back, <b>{loggedUser?.username || loggedUser?.sub}</b></p>
        </div>
      </div>

      {/* ================= KPIs ================= */}
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

      {/* ================= OPEN PROJECT ================= */}
      <div className="card" style={{ marginTop: 24 }}>
        <h3>Open Project Dashboard</h3>
        <input
          placeholder="Project ID"
          value={projectId}
          onChange={e => setProjectId(e.target.value)}
        />
        <button onClick={openProjectDashboard}>Open</button>
      </div>

      {/* ================= USERS TABLE ================= */}
      <UsersTable />

      {/* ================= AUDIT LOG TABLE ================= */}
      <AuditLogTable />

    </div>
  );
}

/* ========================================================= */
/* ================= USERS TABLE =========================== */
/* ========================================================= */
function UsersTable() {
  const PAGE_SIZE = 5;
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const [showReset, setShowReset] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const loggedUser = decodeToken(); // 👈 get current logged user

  useEffect(() => {
    load();
  }, [page]);

  async function load() {
    const res = await getUsers(page - 1, PAGE_SIZE);
    setData(res.content || []);
    setTotalPages(res.totalPages || 1);
  }

  async function handleChangePassword() {
    if (!newPassword || !confirmPassword)
      return alert("All fields required");

    if (newPassword !== confirmPassword)
      return alert("Passwords do not match");

    try {
      await resetUserPassword(selectedUser.id, {
        newPassword
      });

      alert("Password changed successfully");

      setShowReset(false);
      setNewPassword("");
      setConfirmPassword("");
      setShowPass(false);

    } catch (err) {
      alert(err.message || "Password reset failed");
    }
  }

  const isFounder = loggedUser?.role === "FOUNDER";

  return (
    <>
      <div className="card" style={{ marginTop: 32 }}>
        <h3>👤 Users</h3>

        <table className="styled-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Role</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Reset</th>
            </tr>
          </thead>

          <tbody>
            {data.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.role}</td>
                <td>{u.createdAt}</td>
                <td>{u.updatedAt}</td>
                <td>
                  {isFounder ? (
                    <button
                      onClick={() => {
                        setSelectedUser(u);
                        setShowReset(true);
                      }}
                    >
                      Reset Password
                    </button>
                  ) : (
                    <button disabled style={{ opacity: 0.5 }}>
                      Not Allowed
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </div>

      {/* ================= RESET PASSWORD MODAL ================= */}
      {showReset && selectedUser && (
        <div className="modal">
          <div className="modal-card">
            <h3>Reset Password</h3>

            <div className="date-field">
              <label>Username</label>
              <input value={selectedUser.username} disabled />
            </div>

            <div className="date-field password-field">
              <label>New Password</label>
              <div className="password-wrapper">
                <input
                  type={showPass ? "text" : "password"}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="date-field password-field">
              <label>Confirm Password</label>
              <div className="password-wrapper">
                <input
                  type={showPass ? "text" : "password"}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button onClick={handleChangePassword}>
              Change Password
            </button>

            <button
              className="secondary"
              onClick={() => setShowReset(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ========================================================= */
/* ================= AUDIT LOG TABLE ======================= */
/* ========================================================= */
function AuditLogTable() {
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    load();
  }, [page]);

  async function load() {
    const res = await getAuditLogs(page - 1, PAGE_SIZE);
    setData(res.content || []);
    setTotalPages(res.totalPages || 1);
  }

  return (
    <div className="card" style={{ marginTop: 32 }}>
      <h3>📝 Audit Logs</h3>

      <table className="styled-table">
        <thead>
          <tr>
            <th>ID</th><th>User</th><th>Module</th><th>Action</th><th>Note</th><th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {data.map(l => (
            <tr key={l.id}>
              <td>{l.id}</td>
              <td>{l.username}</td>
              <td>{l.module}</td>
              <td>{l.action}</td>
              <td>{l.note}</td>
              <td>{l.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
}

/* ================= PAGINATION ================= */
function Pagination({ page, totalPages, setPage }) {
  return (
    <div className="pagination">
      <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
      <span>Page {page} of {totalPages}</span>
      <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
    </div>
  );
}
