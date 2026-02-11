import { useEffect, useState } from "react";
import {
  getInventory,
  addInventoryItem,
  updateInventoryItem
} from "../services/inventoryService";

import { getFinishedGoods } from "../services/finishedGoodsService";

const PAGE_SIZE = 10;

export default function Inventory() {
  /* ================= INVENTORY ================= */
  const [inventory, setInventory] = useState([]);
  const [itemCategory, setItemName] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState("");
  const [location, setLocation] = useState("");
  const [editId, setEditId] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* ================= FINISHED GOODS ================= */
  const [finishedGoods, setFinishedGoods] = useState([]);
  const [fgPage, setFgPage] = useState(1);
  const [fgTotalPages, setFgTotalPages] = useState(1);

  /* ================= LOAD INVENTORY ================= */
  useEffect(() => {
    loadInventory(page);
  }, [page]);

  async function loadInventory(p) {
    try {
      const res = await getInventory(p - 1, PAGE_SIZE);
      setInventory(Array.isArray(res?.content) ? res.content : []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Inventory load failed", err);
      setInventory([]);
    }
  }

  /* ================= LOAD FINISHED GOODS ================= */
  useEffect(() => {
    loadFinishedGoods(fgPage);
  }, [fgPage]);

  async function loadFinishedGoods(p) {
    try {
      const res = await getFinishedGoods(p - 1, PAGE_SIZE);
      setFinishedGoods(Array.isArray(res?.content) ? res.content : []);
      setFgTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Finished goods load failed", err);
      setFinishedGoods([]);
    }
  }

  /* ================= ADD / UPDATE INVENTORY ================= */
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

      {/* ADD / EDIT INVENTORY */}
      <div className="card form-row">
        <div className="date-field">
          <label>Item Category</label>
          <input value={itemCategory} placeholder="--" onChange={e => setItemName(e.target.value)} />
        </div>
        <div className="date-field">
          <label>Item Code</label>
          <input value={itemCode} placeholder="--" onChange={e => setItemCode(e.target.value)} />
        </div>
        <div className="date-field">
          <label>Quantity</label>
          <input type="number" value={qty} placeholder="0" onChange={e => setQty(e.target.value)} />
        </div>
        <div className="date-field">
          <label>Unit</label>
          <input value={unit} placeholder="pcs/kg/box" onChange={e => setUnit(e.target.value)} />
        </div>
        <div className="date-field">
          <label>Location</label>
          <input value={location} placeholder="--" onChange={e => setLocation(e.target.value)} />
        </div>

        <button onClick={submitItem}>{editId ? "Update" : "Add"}</button>
      </div>

      {/* INVENTORY TABLE */}
      <div className="card">
        <table className="styled-table">
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
            {inventory.map(i => (
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
            ))}
          </tbody>
        </table>
      </div>

      {/* INVENTORY PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} className={page === i + 1 ? "active" : ""} onClick={() => setPage(i + 1)}>
              {i + 1}
            </button>
          ))}
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}

      {/* ================= FINISHED GOODS TABLE ================= */}
      <h2 style={{ marginTop: "30px" }}>Finished Goods</h2>

      <div className="card">
        <table className="styled-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Project ID</th>
              <th>Production Order ID</th>
              <th>Product Code</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {finishedGoods.length > 0 ? (
              finishedGoods.map(fg => (
                <tr key={fg.id}>
                  <td>{fg.id}</td>
                  <td>{fg.projectId}</td>
                  <td>{fg.productionOrderId}</td>
                  <td>{fg.productCode}</td>
                  <td>{fg.productName}</td>
                  <td>{fg.quantity}</td>
                  <td>{fg.createdAt ? new Date(fg.createdAt).toLocaleString() : "-"}</td>
                  <td>{fg.updatedAt ? new Date(fg.updatedAt).toLocaleString() : "-"}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="8">No finished goods</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FINISHED GOODS PAGINATION */}
      {fgTotalPages > 1 && (
        <div className="pagination">
          <button disabled={fgPage === 1} onClick={() => setFgPage(fgPage - 1)}>Prev</button>
          {Array.from({ length: fgTotalPages }).map((_, i) => (
            <button key={i} className={fgPage === i + 1 ? "active" : ""} onClick={() => setFgPage(i + 1)}>
              {i + 1}
            </button>
          ))}
          <button disabled={fgPage === fgTotalPages} onClick={() => setFgPage(fgPage + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}
