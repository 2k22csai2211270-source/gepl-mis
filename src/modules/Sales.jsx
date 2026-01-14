import { useState } from "react";
import { motion } from "framer-motion";
import PageWrapper from "../layout/PageWrapper";
import { exportToPDF, exportToExcel } from "../utils/export";


export default function Sales({ sales, setSales }) {
    const [month, setMonth] = useState("");
    const [value, setValue] = useState("");

    function addSale(e) {
        e.preventDefault();
        if (!month || !value) return;

        setSales([...sales, { month, value: Number(value) }]);
        setMonth("");
        setValue("");
    }

    return (
        <PageWrapper>
            <h2>Sales Management</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>
                Monthly sales performance and revenue tracking
            </p>
            <button
                onClick={() =>
                    exportToPDF(
                        "Sales Report",
                        ["Month", "Sales Value"],
                        sales.map(s => [s.month, s.value])
                    )
                }
            >
                Export PDF
            </button>

            <button
                onClick={() => exportToExcel("Sales Report", sales)}
            >
                Export Excel
            </button>



            <form onSubmit={addSale} style={{ marginBottom: 20 }}>
                <input
                    placeholder="Month"
                    value={month}
                    onChange={e => setMonth(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Sales value"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                />
                <button>Add</button>
            </form>

            {sales.map((s, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    className="card-hover"
                    style={{
                        padding: 12,
                        marginBottom: 10,
                        borderRadius: 8,
                        background: "var(--bg-sidebar)"
                    }}
                >
                    <b>{s.month}</b> — ₹{s.value}
                </motion.div>
            ))}
        </PageWrapper>
    );
}
