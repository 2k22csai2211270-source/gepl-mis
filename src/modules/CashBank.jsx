import { useState } from "react";
import PageWrapper from "../layout/PageWrapper";
import {
  calculateClosing,
  calculateRunway
} from "../utils/cashLogic";

export default function CashBank({ cashData, setCashData }) {
  const [form, setForm] = useState({
    date: "",
    bank: "",
    opening: "",
    receipts: "",
    payments: ""
  });

  function addEntry(e) {
    e.preventDefault();

    const closing = calculateClosing(
      Number(form.opening),
      Number(form.receipts),
      Number(form.payments)
    );

    setCashData([
      ...cashData,
      {
        ...form,
        opening: Number(form.opening),
        receipts: Number(form.receipts),
        payments: Number(form.payments),
        closing
      }
    ]);

    setForm({
      date: "",
      bank: "",
      opening: "",
      receipts: "",
      payments: ""
    });
  }

  const runway = calculateRunway(cashData);

  return (
    <PageWrapper>
      <h2>Cash & Bank Management</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>
        Daily cash position and survival forecast
      </p>

      {/* FORM */}
      <form onSubmit={addEntry} style={{ marginBottom: 30 }}>
        <input
          type="date"
          value={form.date}
          onChange={e =>
            setForm({ ...form, date: e.target.value })
          }
        />
        <input
          placeholder="Bank Name"
          value={form.bank}
          onChange={e =>
            setForm({ ...form, bank: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Opening Balance"
          value={form.opening}
          onChange={e =>
            setForm({ ...form, opening: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Receipts"
          value={form.receipts}
          onChange={e =>
            setForm({ ...form, receipts: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Payments"
          value={form.payments}
          onChange={e =>
            setForm({ ...form, payments: e.target.value })
          }
        />
        <button>Add Entry</button>
      </form>

      {/* KPI */}
      <div
        className="card-hover"
        style={{
          padding: 20,
          borderRadius: 12,
          background: "var(--bg-card)",
          marginBottom: 30
        }}
      >
        <h3>Cash Runway</h3>
        <h1>
          {runway === Infinity ? "∞" : `${runway} days`}
        </h1>
      </div>

      {/* TABLE */}
      {cashData.map((c, i) => (
        <div
          key={i}
          className="card-hover"
          style={{
            padding: 12,
            marginBottom: 10,
            background: "var(--bg-sidebar)",
            borderRadius: 8
          }}
        >
          <b>{c.date}</b> | {c.bank} | Closing: ₹{c.closing}
        </div>
      ))}
    </PageWrapper>
  );
}
