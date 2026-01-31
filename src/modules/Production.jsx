import { useEffect, useState } from "react";
import {
  getProduction,
  addProduction as addProductionApi,
  updateProduction
} from "../services/productionService";

const PAGE_SIZE = 5;

export default function Production() {
  const [production, setProduction] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    projectId: "",
    productCode: "",
    productName: "",
    plannedQuantity: "",
    remarks: ""
  });

  /* ================= LOAD ================= */
  useEffect(() => {
    loadProduction();
  }, []);

  async function loadProduction(p = page) {
    try {
      const res = await getProduction(p - 1, PAGE_SIZE);
      const list = Array.isArray(res?.content) ? res.content : [];

      setProduction(list);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Load failed", err);
      setProduction([]);
    }
  }

  /* ================= ADD / UPDATE ================= */
  async function submitProduction() {
    if (
      !form.projectId ||
      !form.productCode ||
      !form.productName ||
      !form.plannedQuantity
    )
      return;

    const payload = {
      ...form,
      plannedQuantity: Number(form.plannedQuantity)
    };

    try {
      if (editId) {
        await updateProduction(editId, payload);
      } else {
        await addProductionApi(payload);
      }

      resetForm();
      setEditId(null);
      loadProduction();
    } catch (err) {
      console.error("Save failed", err);
      alert("Save failed");
    }
  }

  function editRow(index) {
    const p = production[index];

    setForm({
      projectId: p.projectId || "",
      productCode: p.productCode || "",
      productName: p.productName || "",
      plannedQuantity: p.plannedQuantity || "",
      remarks: p.remarks || ""
    });

    setEditId(p.id);
  }

  function resetForm() {
    setForm({
      projectId: "",
      productCode: "",
      productName: "",
      plannedQuantity: "",
      remarks: ""
    });
  }

  return (
    <div className="page">
      <h2>Production</h2>

      {/* FORM */}
      <div className="card">
        <div className="form-row">
          <input
            placeholder="Project ID"
            value={form.projectId}
            onChange={e =>
              setForm({ ...form, projectId: e.target.value })
            }
          />

          <input
            placeholder="Product Code"
            value={form.productCode}
            onChange={e =>
              setForm({ ...form, productCode: e.target.value })
            }
          />

          <input
            placeholder="Product Name"
            value={form.productName}
            onChange={e =>
              setForm({ ...form, productName: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Planned Quantity"
            value={form.plannedQuantity}
            onChange={e =>
              setForm({ ...form, plannedQuantity: e.target.value })
            }
          />

          <input
            placeholder="Remarks"
            value={form.remarks}
            onChange={e =>
              setForm({ ...form, remarks: e.target.value })
            }
          />

          <button onClick={submitProduction}>
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
              <th>Project ID</th>
              <th>Product Code</th>
              <th>Product Name</th>
              <th>Planned qty</th>
              <th>Produced qty</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Remarks</th>
              <th>Created By</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {production.map((p, i) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.projectId}</td>
                <td>{p.productCode}</td>
                <td>{p.productName}</td>
                <td>{p.plannedQuantity}</td>
                <td>{p.producedQuantity || "-"}</td>

                <td>
                  <div className="delay-bar">
                    {p.status?.replaceAll("_", " ") || "-"}
                  </div>
                </td>

                <td>{p.startDate || "-"}</td>
                <td>{p.endDate || "-"}</td>
                <td>{p.remarks || "-"}</td>
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
            ))}

            {production.length === 0 && (
              <tr>
                <td colSpan="14">No production data</td>
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
                loadProduction(i + 1);
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
