import { useEffect, useState } from "react";
import {
  getProjects,
  addProject as addProjectApi,
  updateProject
} from "../services/projectService";

const PAGE_SIZE = 10;

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    projectName: "",
    projectCode: "",
    clientName: "",
    plannedStartDate: "",
    plannedEndDate: "",
    plannedBudget: "",
    status: "PLANNED"   // ✅ NEW
  });

  /* ================= LOAD ================= */
  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects(p = page) {
    try {
      const res = await getProjects(p - 1, PAGE_SIZE);
      const list = Array.isArray(res?.content) ? res.content : [];
      setProjects(list);
      setTotalPages(res.totalPages || 1);
    } catch {
      setProjects([]);
    }
  }

  /* ================= ADD / UPDATE ================= */
  async function submitProject() {
    if (
      !form.projectName ||
      !form.projectCode ||
      !form.plannedStartDate ||
      !form.plannedEndDate
    )
      return;

    try {
      if (editId) {
        await updateProject(editId, form);
      } else {
        await addProjectApi({
          ...form,
          status: "PLANNED"   // ✅ FORCE DEFAULT ON ADD
        });
      }

      resetForm();
      setEditId(null);
      loadProjects();
    } catch {
      alert("Save failed");
    }
  }

  function editRow(index) {
    const p = projects[index];

    setForm({
      projectName: p.projectName,
      projectCode: p.projectCode,
      clientName: p.clientName,
      plannedStartDate: p.plannedStartDate,
      plannedEndDate: p.plannedEndDate,
      plannedBudget: p.plannedBudget,
      status: p.status || "PLANNED"
    });

    setEditId(p.id);
  }

  function resetForm() {
    setForm({
      projectName: "",
      projectCode: "",
      clientName: "",
      plannedStartDate: "",
      plannedEndDate: "",
      plannedBudget: "",
      status: "PLANNED"
    });
  }

  /* ================= STATUS BADGE ================= */
  function statusBadge(status) {
    switch (status) {
      case "COMPLETED":
        return "delay-bar delay-green";
      case "IN_PROGRESS":
        return "delay-bar delay-blue";
      case "ON_HOLD":
        return "delay-bar delay-gray";
      case "PLANNED":
        return "delay-bar delay-orange";
      case "CLOSED":
        return "delay-bar delay-red";
      default:
        return "delay-bar";
    }
  }

  return (
    <div className="page">
      <h2>Projects</h2>

      {/* ================= FORM ================= */}
      <div className="card">
        <div className="form-row">
          <div className="date-field">
            <label>Project Name</label>
            <input
              value={form.projectName}
              placeholder="Name.."
              onChange={e => setForm({ ...form, projectName: e.target.value })}
            />
          </div>

          <div className="date-field">
            <label>Project Code</label>
            <input
              value={form.projectCode}
              placeholder="--"
              onChange={e => setForm({ ...form, projectCode: e.target.value })}
            />
          </div>

          <div className="date-field">
            <label>Client Name</label>
            <input
              value={form.clientName}
              placeholder="Name.."
              onChange={e => setForm({ ...form, clientName: e.target.value })}
            />
          </div>

          <div className="date-field">
            <label>Planned Start Date</label>
            <input
              type="date"
              value={form.plannedStartDate}
              onChange={e => setForm({ ...form, plannedStartDate: e.target.value })}
            />
          </div>

          <div className="date-field">
            <label>Planned End Date</label>
            <input
              type="date"
              value={form.plannedEndDate}
              onChange={e => setForm({ ...form, plannedEndDate: e.target.value })}
            />
          </div>

          <div className="date-field">
            <label>Planned Budget</label>
            <input
              type="number"
              value={form.plannedBudget}
              placeholder="--"
              onChange={e => setForm({ ...form, plannedBudget: e.target.value })}
            />
          </div>

          {/* ✅ STATUS DROPDOWN (EDIT MODE ONLY) */}
          {editId && (
            <div className="date-field">
              <label>Status</label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
              >
                <option value="PLANNED">Planned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          )}

          <button onClick={submitProject}>
            {editId ? "Update" : "Add"}
          </button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="card">
        <table className="styled-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Code</th>
              <th>Name</th>
              <th>Client</th>
              <th>Start</th>
              <th>End</th>
              <th>Budget</th>
              <th>Status</th>
              <th>Created By</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {projects.map((p, i) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.projectCode}</td>
                <td>{p.projectName}</td>
                <td>{p.clientName || "-"}</td>
                <td>{p.plannedStartDate}</td>
                <td>{p.plannedEndDate}</td>
                <td>₹ {p.plannedBudget || 0}</td>
                <td>
                  <div className={statusBadge(p.status)}>
                    {p.status}
                  </div>
                </td>
                <td>{p.createdBy || "-"}</td>
                <td>{p.createdAt
                  ? new Date(p.createdAt).toLocaleString()
                  : "-"}
                </td>
                <td>{p.updatedAt
                  ? new Date(p.updatedAt).toLocaleString()
                  : "-"}
                </td>
                <td>
                  <button onClick={() => editRow(i)}>Edit</button>
                </td>
              </tr>
            ))}

            {projects.length === 0 && (
              <tr>
                <td colSpan="9">No projects</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
