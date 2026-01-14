import { useState } from "react";
import { motion } from "framer-motion";
import PageWrapper from "../layout/PageWrapper";
import { exportToPDF, exportToExcel } from "../utils/export";


export default function Production({ production, setProduction }) {
    const [month, setMonth] = useState("");
    const [units, setUnits] = useState("");

    function addProduction(e) {
        e.preventDefault();
        if (!month || !units) return;

        setProduction([...production, { month, units: Number(units) }]);
        setMonth("");
        setUnits("");
    }

    return (
        <PageWrapper>
            <h2>Production Control</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>
                Monitor production output and capacity utilization
            </p>
            <button
                onClick={() =>
                    exportToPDF(
                        "Production Report",
                        ["Month", "Units Produced"],
                        production.map(p => [p.month, p.units])
                    )
                }
            >
                Export PDF
            </button>

            <button
                onClick={() =>
                    exportToExcel("Production Report", production)
                }
            >
                Export Excel
            </button>


            <form onSubmit={addProduction} style={{ marginBottom: 20 }}>
                <input
                    placeholder="Month"
                    value={month}
                    onChange={e => setMonth(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Units produced"
                    value={units}
                    onChange={e => setUnits(e.target.value)}
                />
                <button>Add</button>
            </form>

            {production.map((p, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="card-hover"
                    style={{
                        padding: 12,
                        marginBottom: 10,
                        borderRadius: 8,
                        background: "var(--bg-sidebar)"
                    }}
                >
                    <b>{p.month}</b> — {p.units} units
                </motion.div>
            ))}
        </PageWrapper>
    );
}
