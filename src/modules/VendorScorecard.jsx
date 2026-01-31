import { useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";

export default function VendorScorecard() {
  const [rows, setRows] = useState([]);

  /* LOAD PROCUREMENT DATA */
  useEffect(() => {
    const procurement = JSON.parse(localStorage.getItem("procurement")) || [];
    setRows(procurement);
  }, []);

  /* GROUP BY VENDOR */
  const vendors = useMemo(() => {
    const map = {};

    rows.forEach(r => {
      if (!map[r.vendor]) {
        map[r.vendor] = {
          vendor: r.vendor,
          totalOrders: 0,
          onTime: 0,
          delayed: 0,
          totalDelay: 0,
          penalty: 0
        };
      }

      map[r.vendor].totalOrders++;

      const expected = new Date(r.expectedDate);
      const received = r.receivedDate ? new Date(r.receivedDate) : new Date();
      const diff = Math.floor((received - expected) / 86400000);

      if (diff <= 0) {
        map[r.vendor].onTime++;
      } else {
        map[r.vendor].delayed++;
        map[r.vendor].totalDelay += diff;
        map[r.vendor].penalty += diff * 50 * Number(r.quantity);
      }
    });

    return Object.values(map);
  }, [rows]);

  /* KPI */
  const totalVendors = vendors.length;
  const avgOnTime =
    vendors.reduce((s, v) => s + (v.onTime / v.totalOrders) * 100, 0) /
      (vendors.length || 1);

  const totalPenalty = vendors.reduce((s, v) => s + v.penalty, 0);

  /* CHART */
  const chartData = {
    labels: vendors.map(v => v.vendor),
    datasets: [
      {
        label: "On-Time %",
        data: vendors.map(
          v => Math.round((v.onTime / v.totalOrders) * 100)
        ),
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56,189,248,0.25)",
        tension: 0.4,
        fill: true,
        pointRadius: 4
      }
    ]
  };

  return (
    <div className="page">
      <h2>Vendor Scorecard</h2>

      {/* KPI STRIP */}
      <div className="kpi-grid">
        <div className="card kpi">
          <span>Total Vendors</span>
          <b>{totalVendors}</b>
        </div>

        <div className="card kpi">
          <span>Avg On-Time %</span>
          <b>{Math.round(avgOnTime)}%</b>
        </div>

        <div className="card kpi">
          <span>Total Penalty</span>
          <b>₹ {totalPenalty}</b>
        </div>
      </div>

      {/* CHART */}
      <div className="card">
        <h3>Vendor Delivery Performance</h3>
        <Line data={chartData} />
      </div>

      {/* TABLE */}
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Total Orders</th>
              <th>On-Time %</th>
              <th>Avg Delay</th>
              <th>Penalty ₹</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v, i) => {
              const onTimePct = Math.round(
                (v.onTime / v.totalOrders) * 100
              );
              const avgDelay =
                v.delayed > 0 ? Math.round(v.totalDelay / v.delayed) : 0;

              let rating = "Excellent";
              if (onTimePct < 90) rating = "Average";
              if (onTimePct < 75) rating = "Poor";

              return (
                <tr key={i}>
                  <td>{v.vendor}</td>
                  <td>{v.totalOrders}</td>
                  <td>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        style={{ width: `${onTimePct}%` }}
                      />
                      <span>{onTimePct}%</span>
                    </div>
                  </td>
                  <td>{avgDelay} days</td>
                  <td>₹ {v.penalty}</td>
                  <td>
                    <span className={`badge-pill ${rating.toLowerCase()}`}>
                      {rating}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
