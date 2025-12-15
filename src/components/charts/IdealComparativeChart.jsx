import React, { useMemo, useState, useEffect } from 'react';
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
import { processIdealComparativeData } from '../../utils/dataProcessing';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const IdealComparativeChart = ({ data }) => {
  const { metrics, chartData } = useMemo(() => processIdealComparativeData(data), [data]);
  const [selectedMetric, setSelectedMetric] = useState('');

  // Update selectedMetric when metrics are loaded
  useEffect(() => {
    if (metrics.length > 0 && !selectedMetric) {
      setSelectedMetric(metrics[0]);
    }
  }, [metrics, selectedMetric]);

  // Use selectedMetric or fallback to first metric
  const currentData = chartData[selectedMetric] || [];

  const chartConfig = {
    labels: currentData.map(d => d.country),
    datasets: [
      {
        label: selectedMetric,
        data: currentData.map(d => d.value),
        backgroundColor: currentData.map(d => 
          d.country.toLowerCase().includes('ideal') 
            ? 'rgba(16, 185, 129, 0.8)'  // Bright green for Ideal
            : 'rgba(99, 102, 241, 0.7)'   // Indigo for others
        ),
        borderColor: currentData.map(d => 
          d.country.toLowerCase().includes('ideal') 
            ? 'rgba(16, 185, 129, 1)' 
            : 'rgba(99, 102, 241, 1)'
        ),
        borderWidth: 2,
        borderRadius: 4
      }
    ]
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: `Comparative Analysis: ${selectedMetric.replace(/_/g, ' ')}`,
        color: '#f1f5f9',
        font: { size: 18, weight: 'bold' }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        callbacks: {
          label: (ctx) => `${selectedMetric.replace(/_/g, ' ')}: ${ctx.parsed.x.toFixed(2)}`
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: selectedMetric.replace(/_/g, ' '),
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
          font: { size: 11 }
        }
      }
    }
  };

  if (metrics.length === 0) {
    return (
      <div className="w-full h-full min-h-[400px] bg-slate-900/50 rounded-xl border border-indigo-500/20 p-4 flex items-center justify-center">
        <p className="text-slate-400">No data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[400px] bg-slate-900/50 rounded-xl border border-indigo-500/20 p-4">
      <div className="flex justify-between items-center mb-4">
        <label className="text-slate-200 font-medium">Select Metric:</label>
        <select
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
          className="bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer"
        >
          {metrics.map(metric => (
            <option key={metric} value={metric}>
              {metric.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>
      <div className="h-[calc(100%-60px)]">
        <Bar data={chartConfig} options={options} />
      </div>
    </div>
  );
};

export default IdealComparativeChart;
