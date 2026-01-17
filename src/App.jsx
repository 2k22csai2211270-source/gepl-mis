import { useState, useEffect } from "react";
import Login from "./modules/Login";
import Sidebar from "./layout/Sidebar";
import PageWrapper from "./layout/PageWrapper";
import Dashboard from "./dashboards/Dashboard";

import CashBank from "./modules/CashBank";
import Receivables from "./modules/Receivables";
import Payables from "./modules/Payables";
import Inventory from "./modules/Inventory";
import Production from "./modules/Production";
import Projects from "./modules/Projects";
import Procurement from "./modules/Procurement";

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const [cashData, setCashData] = useState([]);
  const [receivables, setReceivables] = useState([]);
  const [payables, setPayables] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [production, setProduction] = useState([]);
  const [projects, setProjects] = useState([]);
  const [procurement, setProcurement] = useState([]);

  useEffect(() => {
    if (user) setPage("dashboard");
  }, [user]);

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div className={`app-shell ${collapsed ? "collapsed" : ""}`}>
      <Sidebar
        user={user}
        page={page}
        setPage={setPage}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <main className="content">
        <div key={page} className="page-transition">
          {page === "dashboard" && (
            <Dashboard
              user={user}
              onLogout={() => setUser(null)}
              cashData={cashData}
              receivables={receivables}
              payables={payables}
              inventory={inventory}
              production={production}
            />
          )}

          {page === "cash" && (
            <PageWrapper title="Cash & Bank">
              <CashBank cashData={cashData} setCashData={setCashData} />
            </PageWrapper>
          )}

          {page === "receivables" && (
            <PageWrapper title="Receivables">
              <Receivables
                receivables={receivables}
                setReceivables={setReceivables}
              />
            </PageWrapper>
          )}

          {page === "payables" && (
            <PageWrapper title="Payables">
              <Payables payables={payables} setPayables={setPayables} />
            </PageWrapper>
          )}

          {page === "inventory" && (
            <PageWrapper title="Inventory">
              <Inventory inventory={inventory} setInventory={setInventory} />
            </PageWrapper>
          )}

          {page === "production" && (
            <PageWrapper title="Production">
              <Production
                production={production}
                setProduction={setProduction}
              />
            </PageWrapper>
          )}

          {page === "projects" && (
            <PageWrapper title="Projects">
              <Projects projects={projects} setProjects={setProjects} />
            </PageWrapper>
          )}

          {page === "procurement" && (
            <PageWrapper title="Procurement">
              <Procurement
                procurement={procurement}
                setProcurement={setProcurement}
              />
            </PageWrapper>
          )}
        </div>
      </main>
    </div>
  );
}
