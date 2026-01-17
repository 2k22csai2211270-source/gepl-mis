export default function Sidebar({
  user,
  page,
  setPage,
  collapsed,
  setCollapsed
}) {
  const menus = {
    admin: [
      ["dashboard", "📊 Dashboard"],
      ["cash", "💰 Cash"],
      ["receivables", "📥 Receivables"],
      ["payables", "📤 Payables"],
      ["inventory", "📦 Inventory"],
      ["production", "🏭 Production"],
      ["projects", "📈 Projects"],
      ["procurement", "🧾 Procurement"]
    ]
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        {!collapsed && <h2>GEPL MIS</h2>}
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          ☰
        </button>
      </div>

      {menus[user.role].map(([key, label]) => (
        <div
          key={key}
          className={`menu-item ${page === key ? "active" : ""}`}
          onClick={() => setPage(key)}
          title={collapsed ? label : ""}
        >
          {collapsed ? label.split(" ")[0] : label}
        </div>
      ))}
    </aside>
  );
}
