import { motion } from "framer-motion";
import { useState } from "react";

export default function Login({ onLogin }) {
    const [role, setRole] = useState("admin");

    function handleLogin() {
        onLogin({
            name: "GEPL User",
            role
        });
    }

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "var(--bg-main)"
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                    width: 360,
                    padding: 30,
                    borderRadius: 12,
                    background: "var(--bg-sidebar)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
                }}
            >
                <h2 style={{ color: "var(--accent)" }}>GEPL MIS</h2>
                <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>
                    Secure Login
                </p>

                <label>Login As</label>
                <select
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    style={{ width: "100%", marginBottom: 20 }}
                >
                    <option value="admin">Admin</option>
                    <option value="sales">Sales</option>
                    <option value="production">Production</option>
                </select>

                
                <button
                    onClick={handleLogin}
                    style={{
                        width: "100%",
                        padding: 14,
                        background: "var(--accent)",
                        border: "none",
                        borderRadius: 8,
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                >
                    Login to MIS
                </button>

            </motion.div>
        </div>
    );
}
