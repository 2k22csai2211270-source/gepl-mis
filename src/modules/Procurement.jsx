import { useEffect, useState } from "react";
import {
  getProcurements,
  addProcurement,
  updateProcurement
} from "../services/procurementService";

const PAGE_SIZE = 5;

export default function Procurement() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [form, setForm] = useState({
    projectId: "",
    bomVersion: "",
    partNo: "",
    description: "",
    supplier: "",
    plannedQty: "",
    orderedQty: "",
    receivedQty: "",
    rate: "",
    leadTime: "",
  });

  const [editingIndex, setEditingIndex] = useState(null);

  /* LOAD FROM API */
  useEffect(() => { loadData(); }, []);

  async function loadData(p = page) {
    try {
      const res = await getProcurements(p - 1, PAGE_SIZE);
      setData(res.content || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Load failed", err);
    }
  }

  /* ADD / UPDATE */
  async function submit() {

    const payload = {
      ...form,
      plannedQty: Number(form.plannedQty || 0),
      orderedQty: Number(form.orderedQty || 0),
      receivedQty: Number(form.receivedQty || 0),
      rate: Number(form.rate || 0),
      leadTime: Number(form.leadTime || 0)
    };

    try {
      if (editingIndex !== null) {
        const id = data[editingIndex].id;
        await updateProcurement(id, payload);
      } else {
        await addProcurement(payload);
      }

      resetForm();
      setEditingIndex(null);
      loadData();
    } catch (err) {
      console.error("Save failed", err);
      alert("Save failed");
    }
  }

  function resetForm() {
    setForm({
      projectId: "",
      bomVersion: "",
      partNo: "",
      description: "",
      supplier: "",
      plannedQty: "",
      orderedQty: "",
      receivedQty: "",
      rate: "",
      leadTime: ""
    });
  }

  function editRow(index) {
    setForm(data[index]);
    setEditingIndex(index);
  }

  return (
    <div className="page">
      <h2>Procurement</h2>

      {/* FORM */}
      <div className="card">
        <div className="form-row">
          <div className="date-field">
            <label>Project ID</label>
            <input placeholder="0" value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })} />
          </div>
          <div className="date-field">
            <label>BOM Version</label>
            <input placeholder="BOM" value={form.bomVersion} onChange={e => setForm({ ...form, bomVersion: e.target.value })} />
          </div>
          <div className="date-field">
            <label>Part No</label>
            <input placeholder="Part No" value={form.partNo} onChange={e => setForm({ ...form, partNo: e.target.value })} />
          </div>
          <div className="date-field">
            <label>Description</label>
            <input placeholder="XYZ..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="date-field">
            <label>Supplier Name</label>
            <input placeholder="Name" value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })} />
          </div>
          <div className="date-field">
            <label>Planned Quantity</label>
            <input type="number" placeholder="0" value={form.plannedQty} onChange={e => setForm({ ...form, plannedQty: e.target.value })} />
          </div>
          <div className="date-field">
            <label>Ordered Quantity</label>
            <input type="number" placeholder="0" value={form.orderedQty} onChange={e => setForm({ ...form, orderedQty: e.target.value })} />
          </div>
          <div className="date-field">
            <label>Received Quantity</label>
            <input type="number" placeholder="0" value={form.receivedQty} onChange={e => setForm({ ...form, receivedQty: e.target.value })} />
          </div>
          <div className="date-field">
            <label>Rate</label>
            <input type="number" placeholder="0" value={form.rate} onChange={e => setForm({ ...form, rate: e.target.value })} />
          </div>
          <div className="date-field">
            <label>Lead Time</label>
            <input type="number" placeholder="0" value={form.leadTime} onChange={e => setForm({ ...form, leadTime: e.target.value })} />
          </div>

          <button onClick={submit}>
            {editingIndex !== null ? "Update" : "Add"}
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th><th>Project ID</th><th>BOM Version</th>
              <th>Part No</th><th>Description</th><th>Supplier</th>
              <th>Planned Qty</th><th>Ordered Qty</th><th>Received Qty</th>
              <th>Rate</th><th>Total Value</th><th>Lead Time</th>
              <th>Excess Qty</th><th>Created At</th><th>Updated At</th><th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row, i) => {
              const totalValue = (row.orderedQty || 0) * (row.rate || 0);
              const excess = (row.receivedQty || 0) - (row.orderedQty || 0);

              return (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.projectId}</td>
                  <td>{row.bomVersion}</td>
                  <td>{row.partNo}</td>
                  <td>{row.description}</td>
                  <td>{row.supplier}</td>
                  <td>{row.plannedQty}</td>
                  <td>{row.orderedQty}</td>
                  <td>{row.receivedQty}</td>
                  <td>₹ {row.rate}</td>
                  <td><b>₹ {totalValue}</b></td>
                  <td>{row.leadTime}</td>
                  <td>{row.excessQty}</td>
                  <td>{row.createdAt ? new Date(row.createdAt).toLocaleString() : "-"}</td>
                  <td>{row.updatedAt ? new Date(row.updatedAt).toLocaleString() : "-"}</td>
                  <td><button onClick={() => editRow(i)}>Edit</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="pagination">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button key={i}
            className={page === i + 1 ? "active" : ""}
            onClick={() => { setPage(i + 1); loadData(i + 1); }}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
