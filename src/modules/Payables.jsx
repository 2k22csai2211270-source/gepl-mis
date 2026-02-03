import { useEffect, useState } from "react";
import { exportToExcel } from "../utils/exportExcel";
import { Line } from "react-chartjs-2";
import {
  getPayables,
  addPayable
} from "../services/payablesService";
import { addCashTransaction } from "../services/cashBankService";

const PAGE_SIZE = 5;

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
    loadPayables();
  }, []);

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
      loadPayables();
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

    const payload = {
      type: "OUT",
      amount: Number(paymentForm.amount),
      category: "Payment",
      referenceType: "Payables",
      referenceId: selectedPayable.id,
      projectId: selectedPayable.projectId,
      description: `Payment made to ${selectedPayable.vendorName} (Invoice ${selectedPayable.invoiceNo})`,
      txnDate: paymentForm.paymentDate
    };

    try {
      await addCashTransaction(payload);

      alert("Payment added to Cash");

      setPaymentMode(false);
      setSelectedPayable(null);
      setPaymentForm({ paymentDate: "", amount: "" });
    } catch (err) {
      console.error("Payment failed", err);
      alert("Payment failed");
    }
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

  /* ================= CHART ================= */
  const chartData = {
    labels: data.map(p => p.dueDate),
    datasets: [
      {
        label: "Payables Amount",
        data: data.map(p => p.invoiceAmount),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239,68,68,0.25)",
        tension: 0.4,
        fill: true
      }
    ]
  };

  /* ================= UI ================= */
  return (
    <div className="module">
      <h2>Payables</h2>

      {/* ================= ADD PAYABLE ================= */}
      <div className="card form-card">
        <h3>Add Vendor Invoice</h3>

        <div className="date-field">
          <label>Vendor Name</label>
          <input
            placeholder="Name"
            value={form.vendorName}
            onChange={e => setForm({ ...form, vendorName: e.target.value })}
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
            placeholder="Invoice Amount"
            value={form.invoiceAmount}
            onChange={e =>
              setForm({ ...form, invoiceAmount: e.target.value })
            }
          />
        </div>

        <button onClick={submitPayable}>Add Payable</button>
      </div>

      {/* ================= MAKE PAYMENT FORM ================= */}
      {paymentMode && selectedPayable && (
        <div className="card form-card">
          <h3>Make Payment</h3>

          <p><strong>Vendor:</strong> {selectedPayable.vendorName}</p>
          <p><strong>Invoice:</strong> {selectedPayable.invoiceNo}</p>

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

      {/* ================= EXPORT ================= */}
      <div className="card">
        <button onClick={() => exportToExcel(filtered, "Payables")}>
          Export to Excel
        </button>
      </div>

      {/* ================= SEARCH ================= */}
      <input
        className="search"
        placeholder="Search vendor..."
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {/* ================= CHART ================= */}
      {data.length > 0 && (
        <div className="card">
          <h3>Payables Trend</h3>
          <Line data={chartData} />
        </div>
      )}

      {/* ================= TABLE ================= */}
      <div className="card table-card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Vendor</th>
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
              filtered.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.vendorName}</td>
                  <td>{p.projectId ?? "-"}</td>
                  <td>{p.invoiceNo}</td>
                  <td>{p.invoiceDate}</td>
                  <td>{p.dueDate || "-"}</td>
                  <td>₹ {p.invoiceAmount}</td>
                  <td>{p.status}</td>
                  <td>
                    <button
                      onClick={() => {
                        setSelectedPayable(p);
                        setPaymentForm({
                          paymentDate: "",
                          amount: p.invoiceAmount
                        });
                        setPaymentMode(true);
                      }}
                    >
                      Make Payment
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
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
