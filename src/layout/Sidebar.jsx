import {
  FaChartPie,
  FaMoneyBillWave,
  FaClipboardList,
  FaBoxes,
  FaIndustry,
  FaProjectDiagram,
  FaShoppingCart
} from "react-icons/fa";

export default function Sidebar({
  user,
  page,
  setPage,
  collapsed
}) {
  /* ✅ ROLE SAFE NORMALIZATION */
  const role =
    typeof user?.role === "object"
      ? user.role.name
      : user?.role || "ACCOUNTS";

  const menusByRole = {
    FOUNDER: [
      { id: "dashboard", label: "Dashboard", icon: <FaChartPie /> },
      { id: "cash", label: "Cash & Bank", icon: <FaMoneyBillWave /> },
      { id: "receivables", label: "Receivables", icon: <FaClipboardList /> },
      { id: "payables", label: "Payables", icon: <FaClipboardList /> },
      { id: "inventory", label: "Inventory", icon: <FaBoxes /> },
      { id: "production", label: "Production", icon: <FaIndustry /> },
      { id: "projects", label: "Projects", icon: <FaProjectDiagram /> },
      { id: "procurement", label: "Procurement", icon: <FaShoppingCart /> }
    ],

    ACCOUNTS: [
      { id: "dashboard", label: "Dashboard", icon: <FaChartPie /> },
      { id: "cash", label: "Cash & Bank", icon: <FaMoneyBillWave /> },
      { id: "receivables", label: "Receivables", icon: <FaClipboardList /> },
      { id: "payables", label: "Payables", icon: <FaClipboardList /> }
    ],

    PRODUCTION: [
      { id: "dashboard", label: "Dashboard", icon: <FaChartPie /> },
      { id: "production", label: "Production", icon: <FaIndustry /> },
      { id: "inventory", label: "Inventory", icon: <FaBoxes /> }
    ],

    PURCHASE: [
      { id: "dashboard", label: "Dashboard", icon: <FaChartPie /> },
      { id: "procurement", label: "Procurement", icon: <FaShoppingCart /> },
      { id: "inventory", label: "Inventory", icon: <FaBoxes /> }
    ]
  };

  /* ✅ SAFE MENU */
  const menus = menusByRole[role] || [];

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="brand">
          <h1>GEATPEC ELECTRONICS</h1>
          <p style={{ fontSize: 12, color: "#94a3b8" }}>
            Role: {role}
          </p>
        </div>
      </div>

      <nav className="sidebar-menu">
        {menus.length === 0 && (
          <p style={{ color: "#94a3b8", padding: 12 }}>
            No modules assigned
          </p>
        )}

        {menus.map(item => (
          <button
            key={item.id}
            className={page === item.id ? "active" : ""}
            onClick={() => setPage(item.id)}
          >
            <span className="icon">{item.icon}</span>
            {!collapsed && item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}