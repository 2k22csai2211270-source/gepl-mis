import { calculateRunway } from "./cashLogic";

export function generateAlerts(
  inventory = [],
  sales = [],
  production = [],
  cashData = [],
  receivables = []
) {
  const alerts = [];

  /* =========================
     INVENTORY ALERTS
     ========================= */

  if (inventory.length === 0) {
    alerts.push({
      type: "critical",
      message: "No inventory data available"
    });
  }

  inventory.forEach(item => {
    if (item.qty < 100) {
      alerts.push({
        type: "warning",
        message: `Low stock: ${item.name} (${item.qty})`
      });
    }
  });

  /* =========================
     SALES vs PRODUCTION ALERT
     ========================= */

  const totalSales = sales.reduce(
    (sum, s) => sum + Number(s.value || 0),
    0
  );

  const totalProduction = production.reduce(
    (sum, p) => sum + Number(p.units || 0),
    0
  );

  if (totalProduction > totalSales && totalSales > 0) {
    alerts.push({
      type: "info",
      message:
        "Production exceeds sales – possible overstock risk"
    });
  }

  /* =========================
     CASH & BANK ALERTS (STEP 22)
     ========================= */

  const runway = calculateRunway(cashData);

  if (runway > 0 && runway < 30) {
    alerts.push({
      type: "critical",
      message: `Cash runway critical: ${runway} days`
    });
  }

  if (cashData.length === 0) {
    alerts.push({
      type: "warning",
      message: "No cash & bank data entered"
    });
  }

  receivables.forEach(r => {
    const days =
      Math.floor(
        (new Date() - new Date(r.invoiceDate)) /
        (1000 * 60 * 60 * 24)
      );

    if (days > 45) {
      alerts.push({
        type: "warning",
        message: `Receivable overdue: ${r.client} (${days} days)`
      });
    }
  });


  /* =========================
     FINAL OUTPUT
     ========================= */

  return alerts;
}
