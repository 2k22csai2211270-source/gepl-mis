import { motion } from "framer-motion";
import BarChart from "../components/BarChart";
import PieChart from "../components/PieChart";
import Alerts from "../components/Alerts";
import { generateAlerts } from "../utils/alerts";
import PageWrapper from "../layout/PageWrapper";


export default function Dashboard({ inventory, sales, production, employees, cashData, receivables }) {
  const totalSales = sales.reduce((s, i) => s + Number(i.value), 0);
  const totalProduction = production.reduce((s, i) => s + Number(i.units), 0);

  const alerts = generateAlerts(inventory, sales, production, cashData, receivables);

  const kpis = [
    { title: "Employees", value: 42 },
    { title: "Inventory Items", value: inventory.length },
    { title: "Total Sales (₹)", value: totalSales },
    { title: "Total Production Units", value: totalProduction },
    { title: "Employees", value: employees.length }

  ];

  return (
    <PageWrapper>
      <h2 style={{ marginBottom: 20 }}>Dashboard Overview</h2>

      {/* KPI CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20
        }}
      >
        {kpis.map((kpi, index) => (
          <motion.div
            key={index}
            className="card-hover"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
              background: "var(--bg-sidebar)",
              padding: 20,
              borderRadius: 12
            }}
          >
            <p style={{ color: "var(--text-muted)" }}>{kpi.title}</p>
            <h1>{kpi.value}</h1>
          </motion.div>
        ))}
      </div>

      {/* ALERTS */}
      <div style={{ marginTop: 30 }}>
        <h3>System Alerts</h3>
        <Alerts alerts={alerts} />
      </div>

      {/* CHARTS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 20,
          marginTop: 30
        }}
      >
        <div className="card-hover" style={{ padding: 20, borderRadius: 12 }}>
          <h3>Sales Performance</h3>
          <BarChart sales={sales} />
        </div>

        <div className="card-hover" style={{ padding: 20, borderRadius: 12 }}>
          <h3>Inventory Distribution</h3>
          <PieChart inventory={inventory} />
        </div>
      </div>
    </PageWrapper>
  );
}
