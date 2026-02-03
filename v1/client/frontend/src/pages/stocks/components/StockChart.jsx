import React from 'react';
import { Line } from 'react-chartjs-2';

const StockChart = ({ data, loading, stockName }) => {
  if (loading) {
    return (
      <div className="chart-loading">
        <div className="loading-spinner">⟳</div>
        <div>LOADING_CHART_DATA...</div>
      </div>
    );
  }

  const chartData = {
    labels: data.map(d => d.label),
    datasets: [{
      label: stockName,
      data: data.map(d => d.price),
      borderColor: '#00ff00',
      backgroundColor: 'rgba(0, 255, 0, 0.1)',
      borderWidth: 3,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 8,
      pointHoverBackgroundColor: '#00ff00',
      pointHoverBorderColor: '#0a0e27',
      pointHoverBorderWidth: 3,
      fill: true
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(10, 14, 39, 0.98)',
        titleColor: '#00ff00',
        bodyColor: '#00cccc',
        borderColor: '#00ff00',
        borderWidth: 2,
        padding: 15,
        titleFont: {
          family: 'VT323',
          size: 18
        },
        bodyFont: {
          family: 'VT323',
          size: 16
        },
        callbacks: {
          label: function(context) {
            return 'Price: $' + context.parsed.y.toFixed(2);
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 255, 0, 0.1)',
          borderColor: '#00ff00',
          borderWidth: 2
        },
        ticks: {
          color: '#00cccc',
          font: {
            family: 'VT323',
            size: 14
          },
          maxRotation: 0
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 255, 0, 0.1)',
          borderColor: '#00ff00',
          borderWidth: 2
        },
        ticks: {
          color: '#00cccc',
          font: {
            family: 'VT323',
            size: 14
          },
          callback: function(value) {
            return '$' + value.toFixed(2);
          }
        }
      }
    }
  };

  return (
    <div className="stock-chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default StockChart;