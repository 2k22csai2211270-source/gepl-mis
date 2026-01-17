import { useState } from "react";
import { paginate, filterBySearch } from "../utils/listHelpers";

export default function CashBank({ cashData = [], setCashData }) {
  const [type, setType] = useState("in");
  const [amount, setAmount] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editItem, setEditItem] = useState(null);

  const PAGE_SIZE = 5;

  function add() {
    if (!amount) return;
    setCashData([
      ...cashData,
      { id: Date.now(), type, amount: Number(amount) }
    ]);
    setAmount("");
  }

  function remove(id) {
    setCashData(cashData.filter(c => c.id !== id));
  }

  function saveEdit() {
    setCashData(
      cashData.map(c =>
        c.id === editItem.id ? editItem : c
      )
    );
    setEditItem(null);
  }

  const filtered = filterBySearch(cashData, search, ["type"]);
  const paged = paginate(filtered, page, PAGE_SIZE);

  return (
    <div>
      <div className="module-header">
   
        <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="form-card">
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="in">Cash In</option>
          <option value="out">Cash Out</option>
        </select>
        <input placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
        <button onClick={add}>Add</button>
      </div>

      <div className="data-list">
        <div className="data-list-header">
          <span>Type</span>
          <span>Amount</span>
          <span>Action</span>
        </div>

        {paged.map(c => (
          <div key={c.id} className="data-row">
            <span>{c.type === "in" ? "Credit" : "Debit"}</span>
            <span>₹ {c.amount}</span>
            <span>
              <button onClick={() => setEditItem(c)}>✏️</button>
              <button onClick={() => remove(c.id)}>🗑</button>
            </span>
          </div>
        ))}
      </div>

      <Pagination page={page} total={filtered.length} size={PAGE_SIZE} setPage={setPage} />

      {editItem && (
        <EditModal onClose={() => setEditItem(null)}>
          <h3>Edit Transaction</h3>
          <select
            value={editItem.type}
            onChange={e => setEditItem({ ...editItem, type: e.target.value })}
          >
            <option value="in">Cash In</option>
            <option value="out">Cash Out</option>
          </select>
          <input
            value={editItem.amount}
            onChange={e => setEditItem({ ...editItem, amount: Number(e.target.value) })}
          />
          <button onClick={saveEdit}>Save</button>
        </EditModal>
      )}
    </div>
  );
}

/* PAGINATION */
function Pagination({ page, total, size, setPage }) {
  const pages = Math.ceil(total / size);
  if (pages <= 1) return null;
  return (
    <div style={{ marginTop: 16 }}>
      {Array.from({ length: pages }).map((_, i) => (
        <button key={i} onClick={() => setPage(i + 1)}>{i + 1}</button>
      ))}
    </div>
  );
}

/* EDIT MODAL */
function EditModal({ children, onClose }) {
  return (
    <div className="modal">
      <div className="modal-card">
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
