// frontend/src/charts/CandlestickChart.js
// REAL candlestick chart (Chart.js + chartjs-chart-financial)
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
import {
  Chart as ChartJS,
  LinearScale,
  TimeScale,
  Tooltip,
} from 'chart.js';
import {
  CandlestickController,
  CandlestickElement,
} from 'chartjs-chart-financial';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  LinearScale,
  TimeScale,
  Tooltip,
  CandlestickController,
  CandlestickElement
);

function CandlestickChart({ data }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new ChartJS(canvasRef.current, {
      type: 'candlestick',
      data: {
        datasets: [
          {
            label: 'Price',
            data,
            color: {
              up: '#00ff88',
              down: '#ff4d4d',
              unchanged: '#999',
            },
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const o = ctx.raw;
                return `O:${o.o} H:${o.h} L:${o.l} C:${o.c}`;
              },
            },
          },
        },
        scales: {
          x: {
            type: 'time',
            time: { unit: 'day' },
            ticks: { color: '#8aa1b1' },
          },
          y: {
            ticks: { color: '#8aa1b1' },
          },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [data]);

  return <canvas ref={canvasRef} height={320} />;
}

export default CandlestickChart;
