import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function BarChart({ sales }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: sales.map(s => s.month),
        datasets: [
          {
            label: "Sales",
            data: sales.map(s => s.value),
            backgroundColor: "#22c55e"
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: getComputedStyle(document.body)
                .getPropertyValue("--text-main")
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: getComputedStyle(document.body)
                .getPropertyValue("--text-muted")
            }
          },
          y: {
            ticks: {
              color: getComputedStyle(document.body)
                .getPropertyValue("--text-muted")
            }
          }
        }
      }
    });

    return () => chartRef.current?.destroy();
  }, [sales]);

  return <canvas ref={canvasRef} />;
}
