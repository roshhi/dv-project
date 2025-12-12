import React, { useMemo } from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';
import { processOnePersonHouseholdData } from '../../utils/dataProcessing';

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const OnePersonHouseholdChart = ({ data }) => {
  const scatterData = useMemo(() => processOnePersonHouseholdData(data), [data]);

  const chartData = {
    datasets: [
      {
        label: 'Countries',
        data: scatterData,
        backgroundColor: 'rgba(236, 72, 153, 0.6)', // Pink-500
        borderColor: 'rgba(236, 72, 153, 1)',
        borderWidth: 1,
        pointRadius: 6,
        pointHoverRadius: 9
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Solitude vs Wealth: One-Person Households vs GDP',
        color: '#f1f5f9',
        font: { size: 18, weight: 'bold' },
        padding: 20
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        callbacks: {
          label: (context) => {
            const point = context.raw;
            return `${point.country}: GDP $${Math.round(point.x).toLocaleString()}, ${point.y}% Living Alone`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'GDP Per Capita (USD)',
          color: '#cbd5e1',
          font: { size: 14, weight: 'bold' }
        },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      },
      y: {
        title: {
          display: true,
          text: '% One-Person Households',
          color: '#cbd5e1',
          font: { size: 14, weight: 'bold' }
        },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' },
        beginAtZero: true
      }
    }
  };

  return (
    <div className="w-full h-full min-h-[400px] bg-slate-900/50 rounded-xl border border-indigo-500/20 p-4">
      <Scatter data={chartData} options={options} />
    </div>
  );
};

export default OnePersonHouseholdChart;
