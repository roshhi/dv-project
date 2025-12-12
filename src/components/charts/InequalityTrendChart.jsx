import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { processInequalityData } from '../../utils/dataProcessing';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const InequalityTrendChart = ({ data }) => {
  const { years, datasets } = useMemo(() => processInequalityData(data), [data]);
  const [selectedIndicator, setSelectedIndicator] = React.useState('lifeExpectancy');

  const indicators = {
    lifeExpectancy: { label: 'Global Life Expectancy', color: '#10b981', yAxis: 'y' },
    literacyRate: { label: 'Global Literacy Rate', color: '#3b82f6', yAxis: 'y' },
    infantMortality: { label: 'Infant Mortality Rate', color: '#ef4444', yAxis: 'y1' },
    hospitalBeds: { label: 'Hospital Beds per 1000', color: '#8b5cf6', yAxis: 'y1' }
  };

  const currentIndicator = indicators[selectedIndicator];

  const chartData = {
    labels: years,
    datasets: [
      {
        label: currentIndicator.label,
        data: datasets[selectedIndicator],
        borderColor: currentIndicator.color,
        backgroundColor: currentIndicator.color,
        yAxisID: currentIndicator.yAxis === 'y1' ? 'y1' : 'y',
        tension: 0.4, // Smooth line
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false // Hide legend as title/selector serves this purpose
      },
      title: {
        display: true,
        text: currentIndicator.label,
        color: '#f1f5f9',
        font: { size: 18, weight: 'bold' }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1'
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: selectedIndicator === 'infantMortality' || selectedIndicator === 'hospitalBeds' ? 'Rate / Count' : 'Percentage / Years',
          color: '#cbd5e1'
        },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      },
      y1: {
        type: 'linear',
        display: false, // Hide secondary axis logic since we show one at a time, but keep config if needed
        position: 'right',
        grid: { drawOnChartArea: false }
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-900/50 rounded-xl border border-indigo-500/20 p-4">
      <div className="flex justify-end mb-4">
        <select
          value={selectedIndicator}
          onChange={(e) => setSelectedIndicator(e.target.value)}
          className="bg-slate-800 text-white border border-slate-700 rounded px-3 py-1 text-sm focus:outline-none focus:border-indigo-500"
        >
          {Object.entries(indicators).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>
      <div className="flex-grow min-h-0">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default InequalityTrendChart;
