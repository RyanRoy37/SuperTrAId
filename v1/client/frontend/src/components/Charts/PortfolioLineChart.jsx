import React from 'react';
import { Line } from 'react-chartjs-2';
import './Charts.css';

const PortfolioLineChart = ({ data, timeframe }) => {
  const chartData = {
    labels: data.labels,
    datasets: [{
      label: 'Portfolio Value',
      data: data.values,
      borderColor: '#00ff00',
      backgroundColor: 'rgba(0, 255, 0, 0.1)',
      borderWidth: 3,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: '#00ff00',
      pointHoverBorderColor: '#0a0e27',
      pointHoverBorderWidth: 2
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(10, 14, 39, 0.95)',
        titleColor: '#00ff00',
        bodyColor: '#00cccc',
        borderColor: '#00ff00',
        borderWidth: 2,
        padding: 12,
        titleFont: {
          family: 'VT323',
          size: 16
        },
        bodyFont: {
          family: 'VT323',
          size: 14
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 255, 0, 0.1)',
          borderColor: '#00ff00'
        },
        ticks: {
          color: '#00cccc',
          font: {
            family: 'VT323',
            size: 14
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 255, 0, 0.1)',
          borderColor: '#00ff00'
        },
        ticks: {
          color: '#00cccc',
          font: {
            family: 'VT323',
            size: 14
          },
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PortfolioLineChart;