export function generateAlerts(inventory, sales, production) {
  const alerts = [];

  // LOW INVENTORY
  inventory.forEach(item => {
    if (item.qty < 100) {
      alerts.push({
        type: "warning",
        message: `Low stock: ${item.name} (${item.qty})`
      });
    }
  });

  // SALES vs PRODUCTION
  const totalSales = sales.reduce((s, i) => s + i.value, 0);
  const totalProduction = production.reduce((s, i) => s + i.units, 0);

  if (totalProduction > totalSales) {
    alerts.push({
      type: "info",
      message: "Production exceeds sales – possible overstock risk"
    });
  }

  // EMPTY INVENTORY
  if (inventory.length === 0) {
    alerts.push({
      type: "critical",
      message: "No inventory data available"
    });
  }

  return alerts;
}
