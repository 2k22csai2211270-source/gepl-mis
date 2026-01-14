import { generateAlerts } from "../utils/alerts";

export default function Sidebar({
    setPage,
    role = "admin",
    activePage,
    inventory = [],
    sales = [],
    production = [],
    theme,
    setTheme
}) {
    const menuByRole = {
        admin: [
            { label: "Dashboard", page: "dashboard", icon: "📊" },
            { label: "Inventory", page: "inventory", icon: "📦" },
            { label: "Sales", page: "sales", icon: "💰" },
            { label: "Production", page: "production", icon: "🏭" },
            { label: "HR", page: "hr", icon: "👥" }

        ],
        sales: [{ label: "Sales", page: "sales", icon: "💰" }],
        production: [{ label: "Production", page: "production", icon: "🏭" }]
    };

    const alerts = generateAlerts(
        inventory || [],
        sales || [],
        production || []
    );

    return (
        <div className="sidebar">
            <h3 className="logo">
                GEPL MIS
                {alerts.length > 0 && (
                    <span
                        style={{
                            background: "#ef4444",
                            color: "#fff",
                            borderRadius: "50%",
                            padding: "2px 8px",
                            marginLeft: 8,
                            fontSize: 12
                        }}
                    >
                        {alerts.length}
                    </span>
                )}
            </h3>

            {(menuByRole[role] || []).map(item => (
                <button
                    key={item.page}
                    onClick={() => setPage(item.page)}
                    className={activePage === item.page ? "menu active" : "menu"}
                >
                    <span className="icon">{item.icon}</span>
                    {item.label}
                </button>
            ))}
            <button
                onClick={() =>
                    setTheme(theme === "dark" ? "light" : "dark")
                }
                style={{
                    marginBottom: 20,
                    padding: 8,
                    borderRadius: 6,
                    background: "var(--accent)",
                    color: "white",
                    border: "none"
                }}
            >
                {theme === "dark" ? "☀ Light Mode" : "🌙 Dark Mode"}
            </button>

        </div>
    );
}
