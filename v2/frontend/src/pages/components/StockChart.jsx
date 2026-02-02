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

  if (!data || data.length === 0) {
    return <div className="chart-loading">NO_CHART_DATA</div>;
  }

  const chartData = {
    labels: data.map(d => d.label),
    datasets: [
      {
        label: stockName,
        data: data.map(d => d.price),
        borderColor: '#00ff00',
        backgroundColor: 'rgba(0,255,0,0.15)',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: '#00cccc' } },
      y: { ticks: { color: '#00cccc' } },
    },
  };

  return (
    <div className="stock-chart-container">
      <Line
  key={data.length} 
  data={chartData}
  options={options}
/>

    </div>
  );
};

export default StockChart;
