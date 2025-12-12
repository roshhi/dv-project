import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { processNordicData } from '../../utils/dataProcessing';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const NordicBarChart = ({ data }) => {
  const { barData } = useMemo(() => processNordicData(data), [data]);

  const chartData = {
    labels: barData.map(d => d.country),
    datasets: [
      {
        label: 'Institutional Support',
        data: barData.map(d => d.institutional),
        backgroundColor: 'rgba(56, 189, 248, 0.8)',
        borderColor: 'rgba(56, 189, 248, 1)',
        borderWidth: 1
      },
      {
        label: 'Social Cohesion',
        data: barData.map(d => d.social),
        backgroundColor: 'rgba(244, 63, 94, 0.8)',
        borderColor: 'rgba(244, 63, 94, 1)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#cbd5e1' }
      },
      title: {
        display: true,
        text: 'The Support-Cohesion Gap',
        color: '#f1f5f9',
        font: { size: 18, weight: 'bold' }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      }
    }
  };

  return (
    <div className="w-full h-full min-h-[400px] bg-slate-900/50 rounded-xl border border-indigo-500/20 p-4">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default NordicBarChart;
