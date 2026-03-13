import {
  FaChartPie,
  FaMoneyBillWave,
  FaClipboardList,
  FaBoxes,
  FaIndustry,
  FaProjectDiagram,
  FaShoppingCart,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";

const menusByRole = {
  FOUNDER: [
    { id: "dashboard",   label: "Dashboard",       icon: <FaChartPie />,      group: "Overview" },
    { id: "cash",        label: "Cash & Bank",      icon: <FaMoneyBillWave />, group: "Finance" },
    { id: "receivables", label: "Receivables",      icon: <FaClipboardList />, group: "Finance" },
    { id: "payables",    label: "Payables",         icon: <FaClipboardList />, group: "Finance" },
    { id: "inventory",   label: "Inventory",        icon: <FaBoxes />,         group: "Operations" },
    { id: "production",  label: "Production",       icon: <FaIndustry />,      group: "Operations" },
    { id: "qc",          label: "Quality Control",  icon: <FaCheckCircle />,   group: "Operations" },
    { id: "projects",    label: "Projects",         icon: <FaProjectDiagram />,group: "Operations" },
    { id: "procurement", label: "Procurement",      icon: <FaShoppingCart />,  group: "Operations" },
  ],
  ACCOUNTS: [
    { id: "dashboard",   label: "Dashboard",   icon: <FaChartPie />,      group: "Overview" },
    { id: "cash",        label: "Cash & Bank", icon: <FaMoneyBillWave />, group: "Finance" },
    { id: "receivables", label: "Receivables", icon: <FaClipboardList />, group: "Finance" },
    { id: "payables",    label: "Payables",    icon: <FaClipboardList />, group: "Finance" },
  ],
  PRODUCTION: [
    { id: "production", label: "Production",      icon: <FaIndustry />,    group: "Operations" },
    { id: "inventory",  label: "Inventory",       icon: <FaBoxes />,       group: "Operations" },
    { id: "qc",         label: "Quality Control", icon: <FaCheckCircle />, group: "Operations" },
  ],
  PROCUREMENT: [
    { id: "procurement", label: "Procurement",     icon: <FaShoppingCart />,group: "Operations" },
    { id: "inventory",   label: "Inventory",       icon: <FaBoxes />,       group: "Operations" },
    { id: "qc",          label: "Quality Control", icon: <FaCheckCircle />, group: "Operations" },
  ],
  PROJECT: [
    { id: "dashboard",   label: "Dashboard",      icon: <FaChartPie />,      group: "Overview" },
    { id: "production",  label: "Production",     icon: <FaIndustry />,      group: "Operations" },
    { id: "projects",    label: "Projects",       icon: <FaProjectDiagram />,group: "Operations" },
    { id: "procurement", label: "Procurement",    icon: <FaShoppingCart />,  group: "Operations" },
    { id: "qc",          label: "Quality Control",icon: <FaCheckCircle />,   group: "Operations" },
  ],
};

export default function Sidebar({ user, page, setPage, collapsed, setCollapsed }) {
  const role = user?.role || "ACCOUNTS";
  const menus = menusByRole[role] || [];

  // Group menus
  const groups = [];
  const seen = {};
  menus.forEach(item => {
    if (!seen[item.group]) {
      seen[item.group] = true;
      groups.push(item.group);
    }
  });

  return (
    <aside className={`sidebar ${collapsed ? "sidebar--collapsed" : ""}`}>

      {/* Collapse toggle */}
      <button
        className="sidebar-collapse-btn"
        onClick={() => setCollapsed && setCollapsed(!collapsed)}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <FaChevronRight size={11} /> : <FaChevronLeft size={11} />}
      </button>

      {/* Menu groups */}
      <nav className="sidebar-nav">
        {groups.map(group => (
          <div key={group} className="sidebar-group">
            {!collapsed && (
              <span className="sidebar-group-label">{group}</span>
            )}
            <div className="sidebar-group-items">
              {menus.filter(m => m.group === group).map(item => (
                <button
                  key={item.id}
                  className={`sidebar-item ${page === item.id ? "sidebar-item--active" : ""}`}
                  onClick={() => setPage(item.id)}
                  title={collapsed ? item.label : ""}
                >
                  <span className="sidebar-item-icon">{item.icon}</span>
                  {!collapsed && (
                    <span className="sidebar-item-label">{item.label}</span>
                  )}
                  {page === item.id && !collapsed && (
                    <span className="sidebar-item-dot" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom role badge */}
      {!collapsed && (
        <div className="sidebar-footer">
          <div className="sidebar-role-badge">
            <span className="sidebar-role-dot" />
            <span className="sidebar-role-text">{role}</span>
          </div>
        </div>
      )}
    </aside>
  );
}
