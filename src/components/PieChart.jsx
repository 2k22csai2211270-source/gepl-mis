import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function PieChart({ inventory }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: "pie",
      data: {
        labels: inventory.map(i => i.name),
        datasets: [
          {
            data: inventory.map(i => i.qty),
            backgroundColor: [
              "#38bdf8",
              "#22c55e",
              "#f59e0b",
              "#ef4444",
              "#a855f7"
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [inventory]);

  return <canvas ref={canvasRef} />;
}
