export function generateAlerts({
  receivables,
  payables,
  inventory,
  production
}) {
  const alerts = [];

  if (receivables.reduce((s, r) => s + r.amount, 0) > 500000)
    alerts.push("⚠️ High receivables pending");

  if (payables.reduce((s, p) => s + p.amount, 0) > 400000)
    alerts.push("⚠️ Vendor payments due");

  inventory.forEach(i => {
    if (i.qty < 50)
      alerts.push(`📦 Low stock: ${i.name}`);
  });

  if (production.length === 0)
    alerts.push("🏭 No production recorded");

  return alerts;
}
