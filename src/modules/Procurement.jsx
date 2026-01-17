import { useState } from "react";
import { paginate, filterBySearch } from "../utils/listHelpers";

export default function Procurement({ procurement = [], setProcurement }) {
  const [item, setItem] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editItem, setEditItem] = useState(null);

  const PAGE_SIZE = 5;

  function add() {
    if (!item) return;
    setProcurement([...procurement, { id: Date.now(), item }]);
    setItem("");
  }

  function remove(id) {
    setProcurement(procurement.filter(p => p.id !== id));
  }

  function saveEdit() {
    setProcurement(procurement.map(p => p.id === editItem.id ? editItem : p));
    setEditItem(null);
  }

  const filtered = filterBySearch(procurement, search, ["item"]);
  const paged = paginate(filtered, page, PAGE_SIZE);

  return (
    <div>
      <div className="module-header">
       
        <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="form-card">
        <input placeholder="Material Name" value={item} onChange={e => setItem(e.target.value)} />
        <button onClick={add}>Add</button>
      </div>

      <div className="data-list">
        <div className="data-list-header">
          <span>Item</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {paged.map(p => (
          <div key={p.id} className="data-row">
            <span>{p.item}</span>
            <span className="badge-pill badge-blue">Ordered</span>
            <span>
              <button onClick={() => setEditItem(p)}>✏️</button>
              <button onClick={() => remove(p.id)}>🗑</button>
            </span>
          </div>
        ))}
      </div>

      <Pagination page={page} total={filtered.length} size={PAGE_SIZE} setPage={setPage} />

      {editItem && (
        <EditModal onClose={() => setEditItem(null)}>
          <h3>Edit Procurement</h3>
          <input
            value={editItem.item}
            onChange={e => setEditItem({ ...editItem, item: e.target.value })}
          />
          <button onClick={saveEdit}>Save</button>
        </EditModal>
      )}
    </div>
  );
}

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
