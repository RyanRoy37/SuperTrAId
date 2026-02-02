import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchStock, fetchStockHistory } from '../services/stockService';

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

ChartJS.register(
  LinearScale,
  TimeScale,
  Tooltip,
  CandlestickController,
  CandlestickElement
);

function StockDetailsPage() {
  const { id } = useParams();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const [stock, setStock] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [stockData, historyData] = await Promise.all([
          fetchStock(id),
          fetchStockHistory(id),
        ]);

        setStock(stockData);
        setHistory(historyData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  useEffect(() => {
    if (!history.length || !chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new ChartJS(chartRef.current, {
      type: 'candlestick',
      data: {
        datasets: [
          {
            label: 'Daily Price',
            data: history,
            borderColor: '#ccc',
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
            time: {
              unit: 'day',
            },
          },
          y: {
            beginAtZero: false,
          },
        },
      },
    });

    return () => chartInstance.current?.destroy();
  }, [history]);

  if (loading) return <p className="typewriter">Loading stock...</p>;
  if (!stock) return <p>Stock not found</p>;

  return (
    <div className="section-card">
      <h2>{stock.symbol}</h2>
      <p className="muted">
        {stock.company_name} • {stock.exchange}
      </p>

      <canvas ref={chartRef} height="400"></canvas>
    </div>
  );
}

export default StockDetailsPage;
