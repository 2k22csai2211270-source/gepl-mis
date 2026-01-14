import { useState } from "react";
import { motion } from "framer-motion";
import PageWrapper from "../layout/PageWrapper";
import { exportToPDF, exportToExcel } from "../utils/export";


export default function HR({ employees, setEmployees }) {
    const [name, setName] = useState("");
    const [dept, setDept] = useState("");
    const [role, setRole] = useState("");

    function addEmployee(e) {
        e.preventDefault();
        if (!name || !dept || !role) return;

        setEmployees([
            ...employees,
            {
                id: Date.now(),
                name,
                dept,
                role,
                present: true
            }
        ]);

        setName("");
        setDept("");
        setRole("");
    }

    function toggleAttendance(id) {
        setEmployees(
            employees.map(emp =>
                emp.id === id
                    ? { ...emp, present: !emp.present }
                    : emp
            )
        );
    }

    return (
        <PageWrapper>
            <h2>Human Resource Management</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>
                Employee records and attendance monitoring
            </p>
            <button
                onClick={() =>
                    exportToPDF(
                        "Employee Report",
                        ["Name", "Department", "Role", "Attendance"],
                        employees.map(e => [
                            e.name,
                            e.dept,
                            e.role,
                            e.present ? "Present" : "Absent"
                        ])
                    )
                }
            >
                Export PDF
            </button>

            <button
                onClick={() =>
                    exportToExcel("Employee Report", employees)
                }
            >
                Export Excel
            </button>



            {/* ADD EMPLOYEE */}
            <form onSubmit={addEmployee} style={{ marginBottom: 20 }}>
                <input
                    placeholder="Employee Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <input
                    placeholder="Department"
                    value={dept}
                    onChange={e => setDept(e.target.value)}
                />
                <input
                    placeholder="Role"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                />
                <button>Add Employee</button>
            </form>

            {/* EMPLOYEE LIST */}
            {employees.map(emp => (
                <motion.div
                    key={emp.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-hover"
                    style={{
                        padding: 12,
                        marginBottom: 10,
                        borderRadius: 8,
                        background: "var(--bg-sidebar)",
                        display: "flex",
                        justifyContent: "space-between"
                    }}
                >
                    <div>
                        <b>{emp.name}</b> — {emp.dept} ({emp.role})
                    </div>

                    <button onClick={() => toggleAttendance(emp.id)}>
                        {emp.present ? "Present ✅" : "Absent ❌"}
                    </button>
                </motion.div>
            ))}
        </PageWrapper>
    );
}
