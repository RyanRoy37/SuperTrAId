import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

function PortfolioHistoryChart({ snapshots }) {
  const ref = useRef();

  useEffect(() => {
    if (!snapshots.length) return;

    const chart = new Chart(ref.current, {
      type: 'line',
      data: {
        labels: snapshots.map(s => s.date),
        datasets: [
          {
            label: 'Portfolio Value',
            data: snapshots.map(s => s.portfolioValue),
            borderWidth: 2,
          },
          {
            label: 'Unrealized P/L',
            data: snapshots.map(s => s.unrealizedPnL),
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: '#eaeaea',
            },
          },
        },
        scales: {
          x: {
            ticks: { color: '#ccc' },
          },
          y: {
            ticks: { color: '#ccc' },
          },
        },
      },
    });

    return () => chart.destroy();
  }, [snapshots]);

  return <canvas ref={ref} height="120"></canvas>;
}

export default PortfolioHistoryChart;
