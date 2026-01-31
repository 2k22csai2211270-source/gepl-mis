import { useEffect, useState } from "react";
import { exportToExcel } from "../utils/exportExcel";
import {
  getInventory,
  addInventoryItem,
  updateInventoryItem
} from "../services/inventoryService";

const PAGE_SIZE = 5;

export default function Inventory() {
  const [inventory, setInventory] = useState([]);

  const [itemName, setItemName] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState("");
  const [location, setLocation] = useState("");
  const [editId, setEditId] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* ================= LOAD ================= */
  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory(p = page) {
    try {
      const res = await getInventory(p - 1, PAGE_SIZE); // backend is 0-based
      const list = Array.isArray(res?.content) ? res.content : [];

      setInventory(list);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Load failed", err);
      setInventory([]);
    }
  }

  /* ================= ADD / UPDATE ================= */
  async function submitItem() {
    if (!itemName || !itemCode || !qty || !unit || !location) return;

    const payload = {
      itemName: itemName,      // ✅ MUST be camelCase
      itemCode: itemCode,      // ✅ MUST be camelCase
      quantity: Number(qty),
      unit: unit,
      location: location
    };

    try {
      if (editId) {
        await updateInventoryItem(editId, payload);
      } else {
        await addInventoryItem(payload);
      }

      resetForm();
      loadInventory();
    } catch (err) {
      console.error("Save failed", err);
      alert("Save failed");
    }
  }

  /* ================= EDIT ================= */
  function editItem(item) {
    setEditId(item.id);
    setItemName(item.itemName);
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
        <input
          placeholder="Item Name"
          value={itemName}
          onChange={e => setItemName(e.target.value)}
        />
        <input
          placeholder="Item Code"
          value={itemCode}
          onChange={e => setItemCode(e.target.value)}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={qty}
          onChange={e => setQty(e.target.value)}
        />
        <input
          placeholder="Unit"
          value={unit}
          onChange={e => setUnit(e.target.value)}
        />
        <input
          placeholder="Location"
          value={location}
          onChange={e => setLocation(e.target.value)}
        />

        <button onClick={submitItem}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {/* EXPORT */}
      <div className="card">
        <button onClick={() => exportToExcel(inventory, "Inventory")}>
          Export to Excel
        </button>
      </div>

      {/* TABLE */}
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Item Name</th>
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
                  <td>{i.itemName}</td>
                  <td>{i.itemCode}</td>
                  <td>{i.quantity}</td>
                  <td>{i.unit}</td>
                  <td>{i.location}</td>
                  <td>{i.createdBy || "-"}</td>
                  <td>
                    {i.createdAt
                      ? new Date(i.createdAt).toLocaleString()
                      : "-"}
                  </td>
                  <td>
                    {i.updatedAt
                      ? new Date(i.updatedAt).toLocaleString()
                      : "-"}
                  </td>
                  <td>
                    <button onClick={() => editItem(i)}>Edit</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">No items</td>
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
              onClick={() => {
                setPage(i + 1);
                loadInventory(i + 1);
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
