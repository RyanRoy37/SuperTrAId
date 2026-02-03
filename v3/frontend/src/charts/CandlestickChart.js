import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend
} from 'chart.js';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  CandlestickController,
  CandlestickElement,
  Tooltip,
  Legend
);

const CandlestickChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) {
      console.log('Chart data missing:', { hasRef: !!chartRef.current, dataLength: data?.length });
      return;
    }

    const ctx = chartRef.current.getContext('2d');

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const chartData = data.map(item => ({
      x: new Date(item.date).getTime(),
      o: parseFloat(item.open),
      h: parseFloat(item.high),
      l: parseFloat(item.low),
      c: parseFloat(item.close)
    }));

    console.log('Creating chart with data points:', chartData.length);

    try {
      chartInstance.current = new ChartJS(ctx, {
        type: 'candlestick',
        data: {
          datasets: [{
            label: 'Price',
            data: chartData,
            borderColor: '#0f0',
            color: {
              up: '#0f0',
              down: '#f00',
              unchanged: '#888'
            }
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day',
                displayFormats: {
                  day: 'MMM dd'
                }
              },
              ticks: {
                color: '#0f0',
                maxRotation: 45
              },
              grid: {
                color: 'rgba(0, 255, 0, 0.1)'
              }
            },
            y: {
              ticks: {
                color: '#0f0',
                callback: function(value) {
                  return '₹' + value.toFixed(2);
                }
              },
              grid: {
                color: 'rgba(0, 255, 0, 0.1)'
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: '#111',
              titleColor: '#0f0',
              bodyColor: '#0f0',
              borderColor: '#0f0',
              borderWidth: 1,
              callbacks: {
                label: function(context) {
                  const point = context.raw;
                  return [
                    'Open: ₹' + point.o.toFixed(2),
                    'High: ₹' + point.h.toFixed(2),
                    'Low: ₹' + point.l.toFixed(2),
                    'Close: ₹' + point.c.toFixed(2)
                  ];
                }
              }
            }
          }
        }
      });
    } catch (error) {
      console.error('Chart creation error:', error);
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  if (!data || data.length === 0) {
    return <div style={{ padding: '20px', color: '#888' }}>No chart data available</div>;
  }

  return (
    <div style={{ height: '400px', marginTop: '20px' }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default CandlestickChart;