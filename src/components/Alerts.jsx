export default function Alerts({ alerts }) {
  if (alerts.length === 0) {
    return (
      <div style={{ color: "var(--text-muted)" }}>
        No alerts. System healthy ✅
      </div>
    );
  }

  return (
    <div>
      {alerts.map((alert, index) => (
        <div
          key={index}
          style={{
            padding: 12,
            marginBottom: 10,
            borderRadius: 8,
            background:
              alert.type === "critical"
                ? "#7f1d1d"
                : alert.type === "warning"
                ? "#78350f"
                : "#1e293b",
            color: "white"
          }}
        >
          {alert.message}
        </div>
      ))}
    </div>
  );
}
