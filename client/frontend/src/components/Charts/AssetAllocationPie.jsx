import React from 'react';
import { Pie } from 'react-chartjs-2';
import './Charts.css';

const AssetAllocationPie = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [{
      data: data.values,
      backgroundColor: [
        '#00ff00',
        '#00cccc',
        '#ffff00',
        '#ff6600',
        '#ff00ff'
      ],
      borderColor: '#0a0e27',
      borderWidth: 3,
      hoverOffset: 10
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#00ff00',
          font: {
            family: 'VT323',
            size: 16
          },
          padding: 15
        }
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
        },
        callbacks: {
          label: function(context) {
            return context.label + ': ' + context.parsed + '%';
          }
        }
      }
    }
  };

  return (
    <div className="chart-container pie-chart">
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default AssetAllocationPie;