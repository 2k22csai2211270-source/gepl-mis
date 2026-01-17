import { useState } from "react";
import { paginate, filterBySearch } from "../utils/listHelpers";

export default function Inventory({ inventory, setInventory }) {
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 5;

  function addItem() {
    if (!name || !qty) return;
    setInventory([...inventory, { id: Date.now(), name, qty: Number(qty) }]);
    setName("");
    setQty("");
  }

  function remove(id) {
    setInventory(inventory.filter(i => i.id !== id));
  }

  const filtered = filterBySearch(inventory, search, ["name"]);
  const paged = paginate(filtered, page, PAGE_SIZE);

  return (
    <div>
      <div className="module-header">
  
        <input
          placeholder="Search item..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="form-card">
        <input placeholder="Item Name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Quantity" value={qty} onChange={e => setQty(e.target.value)} />
        <button onClick={addItem}>Add Item</button>
      </div>

      <div className="data-list">
        <div className="data-list-header">
          <span>Item</span>
          <span>Qty</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {paged.map(i => (
          <div className="data-row" key={i.id}>
            <span>{i.name}</span>
            <span>{i.qty}</span>
            <span className={`badge-pill ${i.qty < 50 ? "badge-red" : "badge-green"}`}>
              {i.qty < 50 ? "Low" : "OK"}
            </span>
            <button onClick={() => remove(i.id)}>🗑</button>
          </div>
        ))}
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
