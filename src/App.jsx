import { useEffect, useState } from "react";
import Login from "./auth/Login";
import Sidebar from "./layout/Sidebar";
import Dashboard from "./dashboard/Dashboard";
import Inventory from "./modules/Inventory";
import Sales from "./modules/Sales";
import Production from "./modules/Production";
import HR from "./modules/HR";
import CashBank from "./modules/CashBank";
import Receivables from "./modules/Receivables";


export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );


  /* INVENTORY */
  const [inventory, setInventory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("inventory")) || [];
    } catch {
      return [];
    }
  });

  /* SALES */
  const [sales, setSales] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("sales")) || [];
    } catch {
      return [];
    }
  });

  /* HR STATE */
  const [employees, setEmployees] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("employees")) || [];
    } catch {
      return [];
    }
  });


  /* PRODUCTION */
  const [production, setProduction] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("production")) || [];
    } catch {
      return [];
    }
  });

  const [cashData, setCashData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cashData")) || [];
    } catch {
      return [];
    }
  });

  const [receivables, setReceivables] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("receivables")) || [];
    } catch {
      return [];
    }
  });



  /* PERSIST */
  useEffect(() => {
    localStorage.setItem("inventory", JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem("sales", JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem("production", JSON.stringify(production));
  }, [production]);

  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("cashData", JSON.stringify(cashData));
  }, [cashData]);

  useEffect(() => {
    localStorage.setItem(
      "receivables",
      JSON.stringify(receivables)
    );
  }, [receivables]);





  /* LOGIN */
  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="layout">
      <Sidebar
        role={user.role}
        setPage={setPage}
        activePage={page}
        inventory={inventory}
        sales={sales}
        production={production}
        cashData={cashData}
        theme={theme}
        setTheme={setTheme}
      />



      <div className="content">
        {page === "dashboard" && user.role === "admin" && (
          <Dashboard
            inventory={inventory}
            sales={sales}
            production={production}
            employees={employees}
            cashData={cashData}
          />

        )}

        {page === "inventory" && user.role === "admin" && (
          <Inventory
            inventory={inventory}
            setInventory={setInventory}
          />
        )}

        {page === "sales" && (
          <Sales sales={sales} setSales={setSales} />
        )}

        {page === "hr" && user.role === "admin" && (
          <HR employees={employees} setEmployees={setEmployees} />
        )}

        {page === "cash" && user.role === "admin" && (
          <CashBank
            cashData={cashData}
            setCashData={setCashData}
          />
        )}

        {page === "receivables" && user.role === "admin" && (
          <Receivables
            receivables={receivables}
            setReceivables={setReceivables}
          />
        )}




        {page === "production" && (
          <Production
            production={production}
            setProduction={setProduction}
          />
        )}
      </div>
    </div>
  );
}
