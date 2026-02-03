import { useEffect, useState } from "react";
import { exportToExcel } from "../utils/exportExcel";
import {
  getReceivables,
  addReceivable
} from "../services/receivablesService";
import { addCashTransaction } from "../services/cashBankService";

const PAGE_SIZE = 5;

export default function Receivables() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* ================= RECEIVABLE FORM ================= */
  const [form, setForm] = useState({
    clientName: "",
    projectId: "",
    invoiceNo: "",
    invoiceDate: "",
    dueDate: "",
    invoiceAmount: ""
  });

  /* ================= PAYMENT MODE ================= */
  const [paymentMode, setPaymentMode] = useState(false);
  const [selectedReceivable, setSelectedReceivable] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    paymentDate: "",
    amount: ""
  });

  /* ================= LOAD ================= */
  useEffect(() => {
    loadReceivables();
  }, []);

  async function loadReceivables(p = page) {
    try {
      const res = await getReceivables(p - 1, PAGE_SIZE);
      const list = Array.isArray(res?.content) ? res.content : [];
      setData(list);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Load failed", err);
      setData([]);
    }
  }

  /* ================= ADD RECEIVABLE ================= */
  async function submitReceivable() {
    if (
      !form.clientName ||
      !form.invoiceNo ||
      !form.invoiceAmount ||
      !form.invoiceDate
    ) {
      alert("Client, Invoice No, Invoice Date & Amount are required");
      return;
    }

    const payload = {
      clientName: form.clientName,
      projectId: form.projectId ? Number(form.projectId) : null,
      invoiceNo: form.invoiceNo,
      invoiceDate: form.invoiceDate,
      dueDate: form.dueDate || null,
      invoiceAmount: Number(form.invoiceAmount)
    };

    try {
      await addReceivable(payload);
      resetReceivableForm();
      loadReceivables();
    } catch (err) {
      console.error("Save failed", err);
      alert("Save failed");
    }
  }

  /* ================= RECEIVE PAYMENT ================= */
  async function submitPayment() {
    if (!paymentForm.paymentDate || !paymentForm.amount) {
      alert("Payment date and amount are required");
      return;
    }

    const payload = {
      type: "IN",
      amount: Number(paymentForm.amount),
      category: "Receipt",
      referenceType: "Receivables",
      referenceId: selectedReceivable.id,
      projectId: selectedReceivable.projectId,
      description: `Payment received from ${selectedReceivable.clientName} (Invoice ${selectedReceivable.invoiceNo})`,
      txnDate: paymentForm.paymentDate
    };

    try {
      await addCashTransaction(payload);

      alert("Payment successfully added to Cash");

      setPaymentMode(false);
      setSelectedReceivable(null);
      setPaymentForm({ paymentDate: "", amount: "" });
    } catch (err) {
      console.error("Payment failed", err);
      alert("Payment failed");
    }
  }

  function resetReceivableForm() {
    setForm({
      clientName: "",
      projectId: "",
      invoiceNo: "",
      invoiceDate: "",
      dueDate: "",
      invoiceAmount: ""
    });
  }

  /* ================= SEARCH ================= */
  const filtered = data.filter(r =>
    r.clientName?.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= UI ================= */
  return (
    <div className="module">
      <h2>Receivables</h2>

      {/* ================= ADD RECEIVABLE ================= */}
      <div className="card form-card">
        <h3>Add Invoice</h3>
        <div className="date-field">
          <label>Client Name</label>
          <input
            placeholder="Name"
            value={form.clientName}
            onChange={e => setForm({ ...form, clientName: e.target.value })}
          />
        </div>

        <div className="date-field">
          <label>Project ID</label>
          <input
            type="number"
            placeholder="0"
            value={form.projectId}
            onChange={e => setForm({ ...form, projectId: e.target.value })}
          />
        </div>

        <div className="date-field">
          <label>Invoice No</label>
          <input
            placeholder="0"
            value={form.invoiceNo}
            onChange={e => setForm({ ...form, invoiceNo: e.target.value })}
          />
        </div>

        <div className="date-field">
          <label>Invoice Date</label>
          <input
            type="date"
            value={form.invoiceDate}
            onChange={e => setForm({ ...form, invoiceDate: e.target.value })}
          />
        </div>

        <div className="date-field">
          <label>Due Date</label>
          <input
            type="date"
            value={form.dueDate}
            onChange={e => setForm({ ...form, dueDate: e.target.value })}
          />
        </div>

        <div className="date-field">
          <label>Invoice Amount</label>
          <input
            type="number"
            step="0.01"
            placeholder="0"
            value={form.invoiceAmount}
            onChange={e =>
              setForm({ ...form, invoiceAmount: e.target.value })
            }
          />
        </div>

        <button onClick={submitReceivable}>Add Receivable</button>
      </div>

      {/* ================= RECEIVE PAYMENT FORM ================= */}
      {paymentMode && selectedReceivable && (
        <div className="card form-card">
          <h3>Receive Payment</h3>

          <p><strong>Client:</strong> {selectedReceivable.clientName}</p>
          <p><strong>Invoice:</strong> {selectedReceivable.invoiceNo}</p>

          <input
            type="date"
            value={paymentForm.paymentDate}
            onChange={e =>
              setPaymentForm({ ...paymentForm, paymentDate: e.target.value })
            }
          />

          <input
            type="number"
            step="0.01"
            value={paymentForm.amount}
            onChange={e =>
              setPaymentForm({ ...paymentForm, amount: e.target.value })
            }
          />

          <button onClick={submitPayment}>Add to Cash</button>
          <button
            className="secondary"
            onClick={() => {
              setPaymentMode(false);
              setSelectedReceivable(null);
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* ================= EXPORT ================= */}
      <div className="card">
        <button onClick={() => exportToExcel(filtered, "Receivables")}>
          Export to Excel
        </button>
      </div>

      {/* ================= SEARCH ================= */}
      <input
        className="search"
        placeholder="Search client..."
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {/* ================= TABLE ================= */}
      <div className="card table-card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Project</th>
              <th>Invoice No</th>
              <th>Invoice Date</th>
              <th>Due Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((r, i) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.clientName}</td>
                  <td>{r.projectId ?? "-"}</td>
                  <td>{r.invoiceNo}</td>
                  <td>{r.invoiceDate}</td>
                  <td>{r.dueDate || "-"}</td>
                  <td>₹ {r.invoiceAmount}</td>
                  <td>{r.status}</td>
                  <td>
                    <button
                      onClick={() => {
                        setSelectedReceivable(r);
                        setPaymentForm({
                          paymentDate: "",
                          amount: r.invoiceAmount
                        });
                        setPaymentMode(true);
                      }}
                    >
                      Receive Payment
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          <span className="page-info">
            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
          </span>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`page-btn ${page === i + 1 ? "active" : ""}`}
              onClick={() => {
                setPage(i + 1);
                loadReceivables(i + 1);
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
