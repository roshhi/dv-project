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
import { processSuicideStrainData } from '../../utils/dataProcessing';

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SuicideStrainChart = ({ data }) => {
  const scatterData = useMemo(() => processSuicideStrainData(data), [data]);

  const chartData = {
    datasets: [
      {
        label: 'Countries',
        data: scatterData,
        backgroundColor: 'rgba(239, 68, 68, 0.6)', // Red
        borderColor: 'rgba(239, 68, 68, 1)',
        pointRadius: 6,
        pointHoverRadius: 9
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Development Strain: Suicide vs GDP',
        color: '#f1f5f9',
        font: { size: 18, weight: 'bold' }
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.raw.country}: GDP $${Math.round(ctx.raw.x).toLocaleString()}, Rate ${ctx.raw.y.toFixed(1)}`
        }
      }
    },
    scales: {
      x: {
        type: 'linear', // Logarithmic might be better but linear requested/standard
        title: {
          display: true,
          text: 'GDP Per Capita',
          color: '#cbd5e1'
        },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      },
      y: {
        title: {
          display: true,
          text: 'Suicide Rate',
          color: '#cbd5e1'
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

export default SuicideStrainChart;
