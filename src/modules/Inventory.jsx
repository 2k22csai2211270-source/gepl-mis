import { useState } from "react";
import { motion } from "framer-motion";
import PageWrapper from "../layout/PageWrapper";
import { exportToPDF, exportToExcel } from "../utils/export";


export default function Inventory({ inventory, setInventory }) {
    const [name, setName] = useState("");
    const [qty, setQty] = useState("");

    function addItem(e) {
        e.preventDefault();
        if (!name || !qty) return;

        setInventory([...inventory, { name, qty: Number(qty) }]);
        setName("");
        setQty("");
    }

    return (
        <PageWrapper>
            <h2>Inventory Management</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>
                Track raw materials, WIP, and finished goods
            </p>
            <button
                onClick={() =>
                    exportToPDF(
                        "Inventory Report",
                        ["Item Name", "Quantity"],
                        inventory.map(i => [i.name, i.qty])
                    )
                }
            >
                Export PDF
            </button>

            <button
                onClick={() => exportToExcel("Inventory Report", inventory)}
            >
                Export Excel
            </button>



            <form onSubmit={addItem} style={{ marginBottom: 20 }}>
                <input
                    placeholder="Item name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={qty}
                    onChange={e => setQty(e.target.value)}
                />
                <button>Add</button>
            </form>

            {inventory.map((item, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                    className="card-hover"
                    style={{
                        padding: 12,
                        marginBottom: 10,
                        borderRadius: 8,
                        background: "var(--bg-sidebar)"
                    }}
                >
                    <b>{item.name}</b> — Qty: {item.qty}
                </motion.div>

            ))}
        </PageWrapper>
    );
}

