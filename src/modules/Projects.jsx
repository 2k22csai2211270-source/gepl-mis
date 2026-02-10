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
    completed: ""
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
    } catch (err) {
      console.error("Load failed", err);
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
        await addProjectApi(form);
      }

      resetForm();
      setEditId(null);
      loadProjects();
    } catch (err) {
      console.error("Save failed", err);
      alert("Save failed");
    }
  }

  function editRow(index) {
    const p = projects[index];
    setForm(p);
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
      completed: ""
    });
  }

  /* ================= STATUS LOGIC ================= */
  function projectStatus(p) {
    const today = new Date();
    const end = new Date(p.plannedEndDate);

    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (p.completed) {
      const completed = new Date(p.completed);
      const delay = Math.floor((completed - end) / 86400000);

      if (delay > 0)
        return {
          text: `Completed (Late by ${delay} days)`,
          className: "delay-bar delay-red"
        };

      return {
        text: "Completed",
        className: "delay-bar delay-green"
      };
    }

    if (today > end) {
      const delay = Math.floor((today - end) / 86400000);
      return {
        text: `Delayed by ${delay} days`,
        className: "delay-bar delay-red"
      };
    }

    return {
      text: "On Track",
      className: "delay-bar delay-orange"
    };
  }

  return (
    <div className="page">
      <h2>Projects</h2>

      {/* FORM */}
      <div className="card">
        <div className="form-row">
          <div className="date-field">
            <label>Project Name</label>
            <input
              placeholder="Name.."
              value={form.projectName}
              onChange={e =>
                setForm({ ...form, projectName: e.target.value })
              }
            />
          </div>
          <div className="date-field">
            <label>Project Code</label>
            <input
              placeholder="0"
              value={form.projectCode}
              onChange={e =>
                setForm({ ...form, projectCode: e.target.value })
              }
            />
          </div>
          <div className="date-field">
            <label>Client Name</label>
            <input
              placeholder="Name.."
              value={form.clientName}
              onChange={e =>
                setForm({ ...form, clientName: e.target.value })
              }
            />
          </div>
          <div className="date-field">
            <label>Planned Start Date</label>
            <input
              type="date"
              value={form.plannedStartDate}
              onChange={e =>
                setForm({
                  ...form,
                  plannedStartDate: e.target.value
                })
              }
            />
          </div>
          <div className="date-field">
            <label>Planned End Date</label>
            <input
              type="date"
              value={form.plannedEndDate}
              onChange={e =>
                setForm({
                  ...form,
                  plannedEndDate: e.target.value
                })
              }
            />
          </div>
          <div className="date-field">
            <label>Planned Budget</label>
            <input
              type="number"
              placeholder="0"
              value={form.plannedBudget}
              onChange={e =>
                setForm({
                  ...form,
                  plannedBudget: e.target.value
                })
              }
            />
          </div>

          <button onClick={submitProject}>
            {editId ? "Update" : "Add"}
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Project Code</th>
              <th>Project Name</th>
              <th>Client</th>
              <th>Planned Start</th>
              <th>Planned End</th>
              <th>Planned Budget</th>
              <th>Status</th>
              <th>Created By</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p, i) => {
              const status = projectStatus(p);
              return (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.projectCode}</td>
                  <td>{p.projectName}</td>
                  <td>{p.clientName || "-"}</td>
                  <td>{p.plannedStartDate}</td>
                  <td>{p.plannedEndDate}</td>
                  <td>₹ {p.plannedBudget || 0}</td>
                  <td>
                    <div className={status.className}>
                      {status.text}
                    </div>
                  </td>
                  <td>{p.createdBy || "-"}</td>
                  <td>
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleString()
                      : "-"}
                  </td>
                  <td>
                    {p.updatedAt
                      ? new Date(p.updatedAt).toLocaleString()
                      : "-"}
                  </td>
                  <td>
                    <button onClick={() => editRow(i)}>
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}

            {projects.length === 0 && (
              <tr>
                <td colSpan="12">No projects</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={page === i + 1 ? "active" : ""}
              onClick={() => {
                setPage(i + 1);
                loadProjects(i + 1);
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
