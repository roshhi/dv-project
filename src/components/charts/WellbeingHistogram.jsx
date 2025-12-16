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

import { processHistogramData } from '../../utils/dataProcessing';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const WellbeingHistogram = ({ data }) => {
  const { labels, data: histogramData, rawData } = useMemo(() => processHistogramData(data), [data]);



  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Number of Countries',
        data: histogramData,
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.95,
        categoryPercentage: 0.95
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
        text: 'Global Distribution of Wellbeing',
        color: '#f1f5f9',
        font: { size: 18, weight: 'bold' }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1'
      },

    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Wellbeing Index Score',
          color: '#cbd5e1'
        },
        grid: { display: false },
        ticks: { 
          color: '#94a3b8',
          maxTicksLimit: 10,
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        title: {
          display: true,
          text: 'Count of Countries',
          color: '#cbd5e1'
        },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', stepSize: 1 }
      }
    }
  };

  return (
    <div className="w-full h-full min-h-[400px] bg-slate-900/50 rounded-xl border border-indigo-500/20 p-4">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default WellbeingHistogram;
