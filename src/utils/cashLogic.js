// Calculates closing balance
export function calculateClosing(opening, receipts, payments) {
  return opening + receipts - payments;
}

// Predicts how many days company can survive
export function calculateRunway(cashEntries) {
  if (cashEntries.length === 0) return 0;

  const last7Days = cashEntries.slice(-7);

  const avgDailyOutflow =
    last7Days.reduce((sum, e) => sum + e.payments, 0) /
    last7Days.length;

  const latestBalance =
    cashEntries[cashEntries.length - 1].closing;

  if (avgDailyOutflow === 0) return Infinity;

  return Math.floor(latestBalance / avgDailyOutflow);
}
