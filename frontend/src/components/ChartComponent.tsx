import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ChartComponent: React.FC<{ data: number[] }> = ({ data }) => {
  const chartData = {
    labels: data.map((_, index) => `Day ${index + 1}`),
    datasets: [
      {
        label: 'Forecast Value',
        data: data,
        borderColor: '#7B29B8',
        backgroundColor: 'rgba(123, 41, 184, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Economic Forecast Trends', color: '#FFFFFF' },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Value (%)', color: '#FFFFFF' }, ticks: { color: '#FFFFFF' } },
      x: { title: { display: true, text: 'Time', color: '#FFFFFF' }, ticks: { color: '#FFFFFF' } },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default ChartComponent;