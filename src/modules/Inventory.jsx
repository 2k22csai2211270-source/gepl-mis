import { useEffect, useState } from "react";
import {
  getInventory,
  addInventoryItem,
  updateInventoryItem
} from "../services/inventoryService";

const PAGE_SIZE = 10;

export default function Inventory() {
  const [inventory, setInventory] = useState([]);

  const [itemCategory, setItemName] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState("");
  const [location, setLocation] = useState("");
  const [editId, setEditId] = useState(null);

  const [page, setPage] = useState(1); // UI page (1-based)
  const [totalPages, setTotalPages] = useState(1);

  /* ================= LOAD ================= */
  useEffect(() => {
    loadInventory(page);
  }, [page]);

  async function loadInventory(p) {
    try {
      const res = await getInventory(p - 1, PAGE_SIZE); // backend is 0-based
      setInventory(Array.isArray(res?.content) ? res.content : []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Load failed", err);
      setInventory([]);
    }
  }

  /* ================= ADD / UPDATE ================= */
  async function submitItem() {
    if (!itemCategory || !itemCode || !qty || !unit || !location) return;

    const payload = {
      itemCategory,
      itemCode,
      quantity: Number(qty),
      unit,
      location
    };

    try {
      if (editId) {
        await updateInventoryItem(editId, payload);
      } else {
        await addInventoryItem(payload);
      }

      resetForm();
      loadInventory(page);
    } catch (err) {
      console.error("Save failed", err);
      alert("Save failed");
    }
  }

  function editItem(item) {
    setEditId(item.id);
    setItemName(item.itemCategory);
    setItemCode(item.itemCode);
    setQty(item.quantity);
    setUnit(item.unit);
    setLocation(item.location);
  }

  function resetForm() {
    setEditId(null);
    setItemName("");
    setItemCode("");
    setQty("");
    setUnit("");
    setLocation("");
  }

  /* ================= UI ================= */
  return (
    <div className="page">
      <h2>Inventory</h2>

      {/* ADD / EDIT FORM */}
      <div className="card form-row">
        <div className="date-field">
          <label>Item Category</label>
          <input value={itemCategory} placeholder="Name.." onChange={e => setItemName(e.target.value)} />
        </div>
        <div className="date-field">
          <label>Item Code</label>
          <input value={itemCode} placeholder="0" onChange={e => setItemCode(e.target.value)} />
        </div>
        <div className="date-field">
          <label>Quantity</label>
          <input type="number" placeholder="0" value={qty} onChange={e => setQty(e.target.value)} />
        </div>
        <div className="date-field">
          <label>Unit</label>
          <input value={unit} placeholder="pcs/kg/box" onChange={e => setUnit(e.target.value)} />
        </div>
        <div className="date-field">
          <label>Location</label>
          <input value={location} placeholder="..." onChange={e => setLocation(e.target.value)} />
        </div>

        <button onClick={submitItem}>{editId ? "Update" : "Add"}</button>
      </div>

      {/* TABLE */}
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Item Category</th>
              <th>Item Code</th>
              <th>Qty</th>
              <th>Unit</th>
              <th>Location</th>
              <th>Created By</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {inventory.length > 0 ? (
              inventory.map(i => (
                <tr key={i.id}>
                  <td>{i.id}</td>
                  <td>{i.itemCategory}</td>
                  <td>{i.itemCode}</td>
                  <td>{i.quantity}</td>
                  <td>{i.unit}</td>
                  <td>{i.location}</td>
                  <td>{i.createdBy || "-"}</td>
                  <td>{i.createdAt ? new Date(i.createdAt).toLocaleString() : "-"}</td>
                  <td>{i.updatedAt ? new Date(i.updatedAt).toLocaleString() : "-"}</td>
                  <td><button onClick={() => editItem(i)}>Edit</button></td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="10">No items</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION (FIXED) ================= */}
      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
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
