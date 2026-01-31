export function generateAlerts({
  receivables = [],
  payables = [],
  inventory = [],
  production = [],
  procurement = []
}) {
  const alerts = [];
  const today = new Date();

  /* ================= RECEIVABLES ================= */
  receivables.forEach(r => {
    if (!r.dueDate) return;

    const days =
      Math.floor(
        (new Date() - new Date(r.dueDate)) /
        (1000 * 60 * 60 * 24)
      );

    if (days > 45) {
      alerts.push({
        type: "critical",
        message: `Receivable overdue: ${r.client || r.customer} (${days} days)`
      });
    } else if (days > 30) {
      alerts.push({
        type: "warning",
        message: `Receivable nearing overdue: ${r.client || r.customer}`
      });
    }
  });

  /* ================= PAYABLES ================= */
  payables.forEach(p => {
    const due = new Date(p.invoiceDate);
    due.setDate(due.getDate() + 30);
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diff < 0) {
      alerts.push(`Payable overdue: ${p.vendor} (${Math.abs(diff)} days)`);
    }
  });


  /* ================= INVENTORY ================= */
  inventory.forEach(i => {
    if (i.qty <= 5) {
      alerts.push({
        type: "critical",
        message: `Critical stock: ${i.name} (${i.qty})`
      });
    } else if (i.qty <= 10) {
      alerts.push({
        type: "warning",
        message: `Low stock: ${i.name} (${i.qty})`
      });
    }

    if (i.qty * i.rate > 500000) {
      alerts.push({
        type: "warning",
        message: `High inventory value: ${i.name} (₹${i.qty * i.rate})`
      });
    }
  });

  // Procurement alerts
  procurement.forEach(p => {
    const expected = new Date(p.expectedDate);
    const diff = Math.ceil((expected - today) / (1000 * 60 * 60 * 24));

    if (diff < 0) {
      alerts.push(`Procurement delayed: ${p.vendor} (${Math.abs(diff)} days)`);
    }
  });

/* ================= PRODUCTION ================= */
production.forEach(p => {
  if (!p.plannedQty || !p.actualQty) return;

  const variance = p.actualQty - p.plannedQty;

  if (variance < -10) {
    alerts.push({
      type: "critical",
      message: `Production shortfall: ${p.item} (${variance})`
    });
  } else if (variance < 0) {
    alerts.push({
      type: "warning",
      message: `Production behind plan: ${p.item}`
    });
  }

  if (p.defectRate && p.defectRate > 5) {
    alerts.push({
      type: "critical",
      message: `High defect rate: ${p.item} (${p.defectRate}%)`
    });
  }
});

return alerts;
}
