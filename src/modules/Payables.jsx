import { useEffect, useState } from "react";
import {
  getPayables,
  addPayable,
  updatePayable
} from "../services/payablesService";

import { addCashTransaction } from "../services/cashBankService";

const PAGE_SIZE = 10;

export default function Payables() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* ================= PAYABLE FORM ================= */
  const [form, setForm] = useState({
    vendorName: "",
    projectId: "",
    invoiceNo: "",
    invoiceDate: "",
    dueDate: "",
    invoiceAmount: ""
  });

  /* ================= PAYMENT MODE ================= */
  const [paymentMode, setPaymentMode] = useState(false);
  const [selectedPayable, setSelectedPayable] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    paymentDate: "",
    amount: ""
  });

  /* ================= LOAD ================= */
  useEffect(() => {
    loadPayables(page);
  }, [page]);

  async function loadPayables(p = page) {
    try {
      const res = await getPayables(p - 1, PAGE_SIZE);
      const list = Array.isArray(res?.content) ? res.content : [];
      setData(list);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Load failed", err);
      setData([]);
    }
  }

  /* ================= ADD PAYABLE ================= */
  async function submitPayable() {
    if (
      !form.vendorName ||
      !form.invoiceNo ||
      !form.invoiceAmount ||
      !form.invoiceDate
    ) {
      alert("Vendor, Invoice No, Invoice Date & Amount are required");
      return;
    }

    const payload = {
      vendorName: form.vendorName,
      projectId: form.projectId ? Number(form.projectId) : null,
      invoiceNo: form.invoiceNo,
      invoiceDate: form.invoiceDate,
      dueDate: form.dueDate || null,
      invoiceAmount: Number(form.invoiceAmount)
    };

    try {
      await addPayable(payload);
      resetPayableForm();
      loadPayables(page);
    } catch (err) {
      console.error("Save failed", err);
      alert("Save failed");
    }
  }

  /* ================= MAKE PAYMENT ================= */
  async function submitPayment() {
    if (!paymentForm.paymentDate || !paymentForm.amount) {
      alert("Payment date and amount are required");
      return;
    }

    const currentPayment = Number(paymentForm.amount);


    /* 2️⃣ UPDATE PAYABLE (CUMULATIVE) */
    try {
      await updatePayable(selectedPayable.id, {
        amount: currentPayment,                // ✅ FIX
        paymentDate: paymentForm.paymentDate
      });
    } catch (err) {
      console.error("Payable update failed", err);
      alert("Cash deducted, but Payable update failed");
      return;
    }

    /* CLEANUP */
    setPaymentMode(false);
    setSelectedPayable(null);
    setPaymentForm({ paymentDate: "", amount: "" });
    loadPayables(page);
  }


  function resetPayableForm() {
    setForm({
      vendorName: "",
      projectId: "",
      invoiceNo: "",
      invoiceDate: "",
      dueDate: "",
      invoiceAmount: ""
    });
  }

  /* ================= SEARCH ================= */
  const filtered = data.filter(p =>
    p.vendorName?.toLowerCase().includes(search.toLowerCase())
  );

  function getStatusClass(status = "") {
    const s = status.toUpperCase();

    if (s === "PAID") return "status-badge paid";
    if (s.includes("PARTIAL")) return "status-badge partial";
    if (s === "OPEN" || s === "PENDING") return "status-badge open";

    return "status-badge";
  }

  /* ================= UI ================= */
  return (
    <div className="module">
      <h2>Payables</h2>

      {/* ADD PAYABLE */}
      <div className="card form-card">
        <h3>Add Vendor Invoice</h3>

        <div className="date-field">
          <label>Vendor Name</label>
          <input
            value={form.vendorName}
            placeholder="Name.."
            onChange={e => setForm({ ...form, vendorName: e.target.value })}
          />
        </div>

        <div className="date-field">
          <label>Project ID</label>
          <input
            type="number"
            value={form.projectId}
            placeholder="0"
            onChange={e => setForm({ ...form, projectId: e.target.value })}
          />
        </div>

        <div className="date-field">
          <label>Invoice No</label>
          <input
            value={form.invoiceNo}
            placeholder="0"
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

        <button onClick={submitPayable}>Add Payable</button>
      </div>

      {/* MAKE PAYMENT */}
      {paymentMode && selectedPayable && (
        <div className="card form-card">
          <h3>Make Payment</h3>

          <p><b>Vendor:</b> {selectedPayable.vendorName}</p>
          <p><b>Invoice:</b> {selectedPayable.invoiceNo}</p>

          <div className="date-field">
            <label>Payment Date</label>
            <input
              type="date"
              value={paymentForm.paymentDate}
              onChange={e =>
                setPaymentForm({ ...paymentForm, paymentDate: e.target.value })
              }
            />
          </div>

          <div className="date-field">
            <label>Amount</label>
            <input
              type="number"
              step="0.01"
              value={paymentForm.amount}
              onChange={e =>
                setPaymentForm({ ...paymentForm, amount: e.target.value })
              }
            />
          </div>

          <button onClick={submitPayment}>Pay from Cash</button>
          <button
            className="secondary"
            onClick={() => {
              setPaymentMode(false);
              setSelectedPayable(null);
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* SEARCH */}
      <input
        className="search"
        placeholder="Search vendor..."
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {/* TABLE */}
      <div className="card table-card">
        <table className="styled-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Vendor Name</th>
              <th>Project ID</th>
              <th>Invoice No</th>
              <th>Invoice Date</th>
              <th>Due Date</th>
              <th>Amount</th>
              <th>Paid Amount</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Created By</th>
              <th>Updated At</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.vendorName}</td>
                  <td>{p.projectId ?? "-"}</td>
                  <td>{p.invoiceNo}</td>
                  <td>{p.invoiceDate}</td>
                  <td>{p.dueDate || "-"}</td>
                  <td>₹ {p.invoiceAmount}</td>
                  <td>
                    ₹ {p.paidAmount}
                  </td>
                  <td>
                    <span className={getStatusClass(p.status)}>
                      {p.status}
                    </span>
                  </td>
                  <td>{p.createdAt || "-"}</td>
                  <td>{p.createdBy || "-"}</td>
                  <td>{p.updatedAt || "-"}</td>

                  <td>
                    <button
                      disabled={
                        p.status === "PAID" ||
                        (p.paidAmount || 0) >= p.invoiceAmount
                      }
                      onClick={() => {
                        setSelectedPayable(p);
                        setPaymentForm({
                          paymentDate: "",
                          amount: p.invoiceAmount - (p.paidAmount || 0)
                        });
                        setPaymentMode(true);
                      }}
                    >
                      {(p.paidAmount || 0) >= p.invoiceAmount ? "Paid" : "Make Payment"}
                    </button>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={page === i + 1 ? "active" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
