import { useState } from "react";
import { paginate, filterBySearch } from "../utils/listHelpers";

export default function Projects({ projects = [], setProjects }) {
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editItem, setEditItem] = useState(null);

  const PAGE_SIZE = 5;

  function add() {
    if (!name) return;
    setProjects([...projects, { id: Date.now(), name }]);
    setName("");
  }

  function remove(id) {
    setProjects(projects.filter(p => p.id !== id));
  }

  function saveEdit() {
    setProjects(projects.map(p => p.id === editItem.id ? editItem : p));
    setEditItem(null);
  }

  const filtered = filterBySearch(projects, search, ["name"]);
  const paged = paginate(filtered, page, PAGE_SIZE);

  return (
    <div>
      <div className="module-header">
        <input placeholder="Search project..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="form-card">
        <input placeholder="Project Name" value={name} onChange={e => setName(e.target.value)} />
        <button onClick={add}>Add</button>
      </div>

      <div className="data-list">
        <div className="data-list-header">
          <span>Name</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {paged.map(p => (
          <div key={p.id} className="data-row">
            <span>{p.name}</span>
            <span className="badge-pill badge-green">Active</span>
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
          <h3>Edit Project</h3>
          <input
            value={editItem.name}
            onChange={e => setEditItem({ ...editItem, name: e.target.value })}
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
