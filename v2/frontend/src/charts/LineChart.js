// frontend/src/charts/LineChart.js
// REAL intraday / time-series line chart (Chart.js native, no react-chartjs-2)
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);
import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

function LineChart({ labels, values, label = 'Price' }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!labels || !values || labels.length === 0) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label,
            data: values,
            borderWidth: 2,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: { color: '#8aa1b1' },
          },
        },
        scales: {
          x: {
            ticks: { color: '#8aa1b1' },
            grid: { color: 'rgba(255,255,255,0.05)' },
          },
          y: {
            ticks: { color: '#8aa1b1' },
            grid: { color: 'rgba(255,255,255,0.05)' },
          },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [labels, values, label]);

  return <canvas ref={canvasRef} height={280} />;
}

export default LineChart;
