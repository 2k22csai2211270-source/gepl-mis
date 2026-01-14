import { useState } from "react";
import PageWrapper from "../layout/PageWrapper";
import {
  daysBetween,
  getReceivableStatus,
  outstandingAmount
} from "../utils/receivableLogic";

export default function Receivables({
  receivables,
  setReceivables
}) {
  const [form, setForm] = useState({
    client: "",
    invoiceNo: "",
    invoiceDate: "",
    amount: "",
    received: ""
  });

  function addInvoice(e) {
    e.preventDefault();

    setReceivables([
      ...receivables,
      {
        ...form,
        amount: Number(form.amount),
        received: Number(form.received)
      }
    ]);

    setForm({
      client: "",
      invoiceNo: "",
      invoiceDate: "",
      amount: "",
      received: ""
    });
  }

  return (
    <PageWrapper>
      <h2>Receivables Management</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>
        Client payments, aging, and risk tracking
      </p>

      {/* FORM */}
      <form onSubmit={addInvoice} style={{ marginBottom: 30 }}>
        <input placeholder="Client Name"
          value={form.client}
          onChange={e => setForm({ ...form, client: e.target.value })} />
        <input placeholder="Invoice No"
          value={form.invoiceNo}
          onChange={e => setForm({ ...form, invoiceNo: e.target.value })} />
        <input type="date"
          value={form.invoiceDate}
          onChange={e => setForm({ ...form, invoiceDate: e.target.value })} />
        <input type="number" placeholder="Invoice Amount"
          value={form.amount}
          onChange={e => setForm({ ...form, amount: e.target.value })} />
        <input type="number" placeholder="Received Amount"
          value={form.received}
          onChange={e => setForm({ ...form, received: e.target.value })} />
        <button>Add Invoice</button>
      </form>

      {/* TABLE */}
      {receivables.map((r, i) => {
        const days = daysBetween(r.invoiceDate);
        const status = getReceivableStatus(days);
        const outstanding = outstandingAmount(
          r.amount,
          r.received
        );

        return (
          <div key={i}
            className="card-hover"
            style={{
              padding: 12,
              marginBottom: 10,
              borderRadius: 8,
              background:
                status === "RED"
                  ? "#7f1d1d"
                  : status === "AMBER"
                  ? "#78350f"
                  : "var(--bg-sidebar)",
              color: status === "GREEN" ? "inherit" : "#fff"
            }}
          >
            <b>{r.client}</b> | {r.invoiceNo}<br />
            Outstanding: ₹{outstanding} | {days} days | {status}
          </div>
        );
      })}
    </PageWrapper>
  );
}
