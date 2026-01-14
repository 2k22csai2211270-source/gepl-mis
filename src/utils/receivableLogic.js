export function daysBetween(date1) {
  const today = new Date();
  const invoiceDate = new Date(date1);
  return Math.floor(
    (today - invoiceDate) / (1000 * 60 * 60 * 24)
  );
}

export function getReceivableStatus(days) {
  if (days <= 30) return "GREEN";
  if (days <= 60) return "AMBER";
  return "RED";
}

export function outstandingAmount(amount, received) {
  return amount - received;
}
