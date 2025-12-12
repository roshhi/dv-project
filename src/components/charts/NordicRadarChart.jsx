import React, { useMemo } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { processNordicData } from '../../utils/dataProcessing';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const NordicRadarChart = ({ data }) => {
  const { radarData } = useMemo(() => processNordicData(data), [data]);

  const chartData = {
    labels: radarData.labels.map(l => l.replace(/_/g, ' ')),
    datasets: [
      {
        label: 'Nordic Average',
        data: radarData.labels.map(l => radarData.nordic[l]),
        backgroundColor: 'rgba(56, 189, 248, 0.2)',
        borderColor: 'rgba(56, 189, 248, 1)',
        borderWidth: 2,
      },
      {
        label: 'Global Average',
        data: radarData.labels.map(l => radarData.global[l]),
        backgroundColor: 'rgba(148, 163, 184, 0.2)',
        borderColor: 'rgba(148, 163, 184, 1)',
        borderWidth: 2,
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
        text: 'Nordic Profile vs Global Average',
        color: '#f1f5f9',
        font: { size: 18, weight: 'bold' }
      }
    },
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: {
          color: '#cbd5e1',
          font: { size: 12 }
        },
        ticks: {
          backdropColor: 'transparent',
          color: '#94a3b8'
        }
      }
    }
  };

  return (
    <div className="w-full h-full min-h-[400px] bg-slate-900/50 rounded-xl border border-indigo-500/20 p-4">
      <Radar data={chartData} options={options} />
    </div>
  );
};

export default NordicRadarChart;
