import { useEffect, useState } from "react";
import {
  getCashTransactions,
  addCashTransaction,
  updateCashTransaction
} from "../services/cashBankService";

const PAGE_SIZE = 10;

export default function CashBank({ user }) {
  const [data, setData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  // 🔥 Pagination state
  const [page, setPage] = useState(0); // backend page (0-based)
  const [totalPages, setTotalPages] = useState(0);

  const [form, setForm] = useState({
    type: "IN",
    amount: "",
    category: "Advance",
    referenceType: "Manual",
    referenceId: "",
    projectId: "",
    description: "",
    transactionDate: ""
  });

  /* ================= LOAD ================= */
  useEffect(() => {
    loadCash(0); // load first page initially
  }, []);

  async function loadCash(p = page) {
    try {
      const res = await getCashTransactions(p, PAGE_SIZE);

      const list = Array.isArray(res?.content) ? res.content : [];

      const normalized = list.map(item => ({
        ...item,
        type: item.type?.toUpperCase(),
        transactionDate: item.txnDate
      }));

      setData(normalized);
      setTotalPages(res.totalPages || 0);
      setPage(p);
    } catch (err) {
      console.error("Load failed", err);
      setData([]);
    }
  }

  /* ================= ADD / UPDATE ================= */
  async function submit() {
    if (!form.amount || !form.transactionDate) return;

    const now = new Date().toISOString();

    const payload = {
      ...form,
      txnDate: form.transactionDate,
      amount: Number(form.amount),
      createdBy: user?.username || "System",
      createdAt:
        editingIndex === null ? now : data[editingIndex].createdAt,
      updatedAt: now
    };

    delete payload.transactionDate;

    try {
      if (editingIndex !== null) {
        await updateCashTransaction(data[editingIndex].id, payload);
        loadCash(page); // reload same page
      } else {
        await addCashTransaction(payload);
        // 🔥 go to last page to show newly added record
        loadCash(totalPages);
      }

      resetForm();
      setEditingIndex(null);
    } catch (err) {
      console.error("Save failed", err);
      alert("Save failed");
    }
  }

  /* ================= EDIT ================= */
  function editRow(index) {
    const row = data[index];
    setForm({
      type: row.type,
      amount: row.amount,
      category: row.category,
      referenceType: row.referenceType,
      referenceId: row.referenceId,
      projectId: row.projectId,
      description: row.description,
      transactionDate: row.transactionDate
    });
    setEditingIndex(index);
  }

  function resetForm() {
    setForm({
      type: "IN",
      amount: "",
      category: "Advance",
      referenceType: "Manual",
      referenceId: "",
      projectId: "",
      description: "",
      transactionDate: ""
    });
  }

  /* ================= UI ================= */
  return (
    <div className="page">
      <h2>Cash & Bank</h2>

      {/* ================= FORM ================= */}
      <div className="card">
        <div className="form-row">
          <div className="date-field">
            <label>Type</label>
            <select
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
            >
              <option value="IN">IN</option>
              <option value="OUT">OUT</option>
            </select>
          </div>

          <div className="date-field">
            <label>Amount</label>
            <input
              type="number"
              placeholder="0"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
            />
          </div>

          <div className="date-field">
            <label>Category</label>
            <select
              value={form.category}
              onChange={e =>
                setForm({ ...form, category: e.target.value })
              }
            >
              <option>Advance</option>
              <option>Expense</option>
              <option>Payment</option>
              <option>Refund</option>
              <option>Receipt</option>
              <option>Transfer</option>
            </select>
          </div>

          <div className="date-field">
            <label>Reference Type</label>
            <select
              value={form.referenceType}
              onChange={e =>
                setForm({ ...form, referenceType: e.target.value })
              }
            >
              <option>Manual</option>
              <option>Receivables</option>
              <option>Payables</option>
            </select>
          </div>

          <div className="date-field">
            <label>Reference ID</label>
            <input
              placeholder="0"
              value={form.referenceId}
              onChange={e =>
                setForm({ ...form, referenceId: e.target.value })
              }
            />
          </div>
          <div className="date-field">
            <label>Project ID</label>
            <input
              placeholder="0"
              value={form.projectId}
              onChange={e =>
                setForm({ ...form, projectId: e.target.value })
              }
            />
          </div>
          <div className="date-field">
            <label>Description</label>
            <input
              value={form.description}
              placeholder="XYZ..."
              onChange={e =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
          <div className="date-field">
            <label>Transaction Date</label>
            <input
              type="date"
              value={form.transactionDate}
              onChange={e =>
                setForm({ ...form, transactionDate: e.target.value })
              }
            />
          </div>

          <button onClick={submit}>
            {editingIndex !== null ? "Update" : "Add"}
          </button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Txn ID</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Txn Date</th>
              <th>Category</th>
              <th>Ref Type</th>
              <th>Ref ID</th>
              <th>Project ID</th>
              <th>Created By</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((c, i) => (
                <tr key={c.id || i}>
                  <td>{c.transactionId || c.id}</td>
                  <td>{c.type}</td>
                  <td>₹ {c.amount}</td>
                  <td>{c.transactionDate}</td>
                  <td>{c.category}</td>
                  <td>{c.referenceType}</td>
                  <td>{c.referenceId || "-"}</td>
                  <td>{c.projectId || "-"}</td>
                  <td>{c.createdBy}</td>
                  <td>{new Date(c.createdAt).toLocaleString()}</td>
                  <td>{new Date(c.updatedAt).toLocaleString()}</td>
                  <td>{c.description}</td>
                  <td>
                    <button onClick={() => editRow(i)}>Edit</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12">No transactions</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={page === 0}
            onClick={() => loadCash(page - 1)}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={page === i ? "active" : ""}
              onClick={() => loadCash(i)}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages - 1}
            onClick={() => loadCash(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
