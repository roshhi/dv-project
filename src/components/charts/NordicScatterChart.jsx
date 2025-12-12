import React, { useMemo } from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { processNordicData } from '../../utils/dataProcessing';

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const NordicScatterChart = ({ data }) => {
  const { scatterData } = useMemo(() => processNordicData(data), [data]);

  const nordicPoints = scatterData.filter(d => d.isNordic);
  const otherPoints = scatterData.filter(d => !d.isNordic);

  const chartData = {
    datasets: [
      {
        label: 'Nordic Countries',
        data: nordicPoints,
        backgroundColor: 'rgba(56, 189, 248, 1)', // Light Blue
        borderColor: 'rgba(56, 189, 248, 1)',
        pointRadius: 8,
        pointHoverRadius: 10
      },
      {
        label: 'Rest of World',
        data: otherPoints,
        backgroundColor: 'rgba(148, 163, 184, 0.5)', // Slate
        borderColor: 'rgba(148, 163, 184, 0.5)',
        pointRadius: 4,
        pointHoverRadius: 6
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
        text: 'The Nordic Paradox: Support vs Cohesion',
        color: '#f1f5f9',
        font: { size: 18, weight: 'bold' }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        callbacks: {
          label: (context) => {
            const point = context.raw;
            return `${point.country}: (Inst: ${point.x.toFixed(1)}, Soc: ${point.y.toFixed(1)})`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Institutional Support Score',
          color: '#cbd5e1',
          font: { weight: 'bold' }
        },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      },
      y: {
        title: {
          display: true,
          text: 'Social Cohesion Score',
          color: '#cbd5e1',
          font: { weight: 'bold' }
        },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      }
    }
  };

  return (
    <div className="w-full h-full min-h-[400px] bg-slate-900/50 rounded-xl border border-indigo-500/20 p-4">
      <Scatter data={chartData} options={options} />
    </div>
  );
};

export default NordicScatterChart;
