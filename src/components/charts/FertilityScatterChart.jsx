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
import { processFertilityData } from '../../utils/dataProcessing';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const FertilityScatterChart = ({ data }) => {
  const scatterData = useMemo(() => processFertilityData(data), [data]);

  const chartData = {
    labels: scatterData.map(d => d.country),
    datasets: [
      {
        label: 'Fertility Rate',
        data: scatterData.map(d => d.y),
        backgroundColor: 'rgba(236, 72, 153, 0.7)', // Pink
        borderColor: 'rgba(236, 72, 153, 1)',
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  };

  const options = {
    indexAxis: 'y', // Horizontal bars
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Fertility Collapse: A Global Strain',
        color: '#f1f5f9',
        font: { size: 18, weight: 'bold' }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        callbacks: {
          label: (ctx) => `Fertility Rate: ${ctx.parsed.x.toFixed(2)}`
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Fertility Rate',
          color: '#cbd5e1',
          font: { weight: 'bold' }
        },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      },
      y: {
        grid: { display: false },
        ticks: { 
          color: '#cbd5e1',
          font: { size: 10 }
        }
      }
    }
  };

  return (
    <div className="w-full h-full min-h-[400px] bg-slate-900/50 rounded-xl border border-indigo-500/20 p-4">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default FertilityScatterChart;
