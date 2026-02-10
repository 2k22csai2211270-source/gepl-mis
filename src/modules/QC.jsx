import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getQCRecords,
  addQCRecord,
  finishQC
} from "../services/qcService";

const PAGE_SIZE = 10;

export default function QC() {
  const { productionOrderId } = useParams();

  /* ================= STATE ================= */
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* ================= FORM ================= */
  const [form, setForm] = useState({
    productionOrderId: "",
    projectId: "",
    inspectedQty: "",
    acceptedQty: "",
    reworkQty: "",
    scrapQty: "",
    remarks: ""
  });

  /* ================= LOAD ================= */
  useEffect(() => {
    loadQC();
  }, [page, productionOrderId]);

  async function loadQC() {
    try {
      const res = await getQCRecords(page - 1, PAGE_SIZE); // backend is 0-based
      setData(res.content || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error(err);
      setData([]);
    }
  }

  /* ================= ADD QC ================= */
  async function submitQC() {
    if (!form.productionOrderId) {
      alert("Production Order ID is required");
      return;
    }

    const payload = {
      inspectedQty: Number(form.inspectedQty),
      acceptedQty: Number(form.acceptedQty),
      reworkQty: Number(form.reworkQty),
      scrapQty: Number(form.scrapQty),
      remarks: form.remarks
    };

    try {
      await addQCRecord(payload, Number(form.productionOrderId));
      alert("QC record added successfully");
      resetForm();
      loadQC();
    } catch (err) {
      alert(err.message);
    }
  }

  function resetForm() {
    setForm({
      productionOrderId: "",
      projectId: "",
      inspectedQty: "",
      acceptedQty: "",
      reworkQty: "",
      scrapQty: "",
      remarks: ""
    });
  }

  /* ================= FINISH QC ================= */
  async function handleFinishQC(qcId) {
    if (!window.confirm("Mark this QC as FINISHED?")) return;

    try {
      await finishQC(qcId);
      alert("QC marked as FINISHED");
      loadQC();
    } catch (err) {
      alert(err.message || "Failed to finish QC");
    }
  }

  /* ================= UI ================= */
  return (
    <div className="module">
      <h2>Quality Control (QC)</h2>

      {/* ================= FORM ================= */}
      <div className="card form-card">
        <h3>Add QC Record</h3>

        <div className="date-field">
          <label>Production Order ID</label>
          <input
            type="number"
            value={form.productionOrderId}
            placeholder="0"
            onChange={e =>
              setForm({ ...form, productionOrderId: e.target.value })
            }
          />
        </div>

        <div className="date-field">
          <label>Project ID</label>
          <input
            value={form.projectId}
            placeholder="0"
            onChange={e =>
              setForm({ ...form, projectId: e.target.value })
            }
          />
        </div>

        <div className="date-field">
          <label>Inspected Qty</label>
          <input
            type="number"
            value={form.inspectedQty}
            placeholder="0"
            onChange={e =>
              setForm({ ...form, inspectedQty: e.target.value })
            }
          />
        </div>

        <div className="date-field">
          <label>Accepted Qty</label>
          <input
            type="number"
            value={form.acceptedQty}
            placeholder="0"
            onChange={e =>
              setForm({ ...form, acceptedQty: e.target.value })
            }
          />
        </div>

        <div className="date-field">
          <label>Rework Qty</label>
          <input
            type="number"
            placeholder="0"
            value={form.reworkQty}
            onChange={e =>
              setForm({ ...form, reworkQty: e.target.value })
            }
          />
        </div>

        <div className="date-field">
          <label>Scrap Qty</label>
          <input
            type="number"
            value={form.scrapQty}
            placeholder="0"
            onChange={e =>
              setForm({ ...form, scrapQty: e.target.value })
            }
          />
        </div>

        <div className="date-field">
          <label>Remarks</label>
          <input
            value={form.remarks}
            placeholder="XYZ.."
            onChange={e =>
              setForm({ ...form, remarks: e.target.value })
            }
          />
        </div>

        <button onClick={submitQC}>Add QC</button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="card table-card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Production Order</th>
              <th>Project</th>
              <th>Inspected</th>
              <th>Accepted</th>
              <th>Rework</th>
              <th>Scrap</th>
              <th>Status</th>
              <th>Remarks</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map(qc => (
                <tr key={qc.id}>
                  <td>{qc.id}</td>
                  <td>{qc.createdAt || "-"}</td>
                  <td>{qc.updatedAt || "-"}</td>
                  <td>{qc.productionOrderId}</td>
                  <td>{qc.projectId || "-"}</td>
                  <td>{qc.inspectedQty}</td>
                  <td>{qc.acceptedQty}</td>
                  <td>{qc.reworkQty}</td>
                  <td>{qc.scrapQty}</td>
                  <td>{qc.status}</td>
                  <td>{qc.remarks || "-"}</td>
                  <td>
                    <button
                      disabled={qc.status === "FINISHED"}
                      onClick={() => handleFinishQC(qc.id)}
                    >
                      {qc.status === "FINISHED" ? "Finished" : "Finish"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12">No QC records</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
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
