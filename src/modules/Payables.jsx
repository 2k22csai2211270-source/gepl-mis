import { useState } from "react";
import { paginate, filterBySearch } from "../utils/listHelpers";

export default function Payables({ payables = [], setPayables }) {
  const [vendor, setVendor] = useState("");
  const [amount, setAmount] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 5;

  function add() {
    if (!vendor || !amount) return;
    setPayables([
      ...payables,
      { id: Date.now(), vendor, amount: Number(amount) }
    ]);
    setVendor("");
    setAmount("");
  }

  function remove(id) {
    setPayables(payables.filter(p => p.id !== id));
  }

  const filtered = filterBySearch(payables, search, ["vendor"]);
  const paged = paginate(filtered, page, PAGE_SIZE);

  return (
    <div>
      <div className="module-header">
        <input
          placeholder="Search vendor..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* FORM */}
      <div className="form-card">
        <input
          placeholder="Vendor"
          value={vendor}
          onChange={e => setVendor(e.target.value)}
        />
        <input
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <button onClick={add}>Add</button>
      </div>

      {/* LIST */}
      <div className="data-list">
        <div className="data-list-header">
          <span>Vendor</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {paged.map(p => (
          <div className="data-row" key={p.id}>
            <span>{p.vendor}</span>
            <span>₹ {p.amount}</span>
            <span className="badge-pill badge-red">Due</span>
            <button onClick={() => remove(p.id)}>🗑</button>
          </div>
        ))}

        {paged.length === 0 && (
          <div className="data-row">
            <span>No payables found</span>
          </div>
        )}
      </div>

      <Pagination
        page={page}
        total={filtered.length}
        size={PAGE_SIZE}
        setPage={setPage}
      />
    </div>
  );
}

/* ✅ MISSING COMPONENT (THIS FIXES THE BUG) */
function Pagination({ page, total, size, setPage }) {
  const pages = Math.ceil(total / size);
  if (pages <= 1) return null;

  return (
    <div style={{ marginTop: 16 }}>
      {Array.from({ length: pages }).map((_, i) => (
        <button
          key={i}
          onClick={() => setPage(i + 1)}
          className={page === i + 1 ? "active" : ""}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
