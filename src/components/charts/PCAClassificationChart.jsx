import React, { useMemo, useState } from 'react';
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
import { processPCAData } from '../../utils/dataProcessing';

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PCAClassificationChart = ({ data, countryMapping }) => {
  const groupedData = useMemo(() => processPCAData(data), [data]);
  const [searchTerm, setSearchTerm] = useState('');

  // Define colors for different groups
  const colors = [
    'rgba(244, 63, 94, 1)',  // Rose
    'rgba(59, 130, 246, 1)', // Blue
    'rgba(16, 185, 129, 1)', // Emerald
    'rgba(245, 158, 11, 1)', // Amber
    'rgba(139, 92, 246, 1)', // Violet
    'rgba(6, 182, 212, 1)',  // Cyan
  ];

  const datasets = Object.keys(groupedData).map((group, index) => {
    const groupPoints = groupedData[group];
    
    // Filter points based on search term
    const filteredPoints = groupPoints.map(point => {
      const countryName = countryMapping?.[point.country] || point.country;
      const isMatch = !searchTerm || 
        countryName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        point.country.toLowerCase().includes(searchTerm.toLowerCase());
      
      return {
        ...point,
        countryName, // Store resolved name
        isMatch // Store match status for styling
      };
    });

    return {
      label: group,
      data: filteredPoints,
      backgroundColor: (ctx) => {
        const point = ctx.raw;
        if (!point) return colors[index % colors.length];
        // Dim non-matching points if search is active
        return searchTerm && !point.isMatch 
          ? 'rgba(255, 255, 255, 0.1)' 
          : colors[index % colors.length];
      },
      borderColor: (ctx) => {
        const point = ctx.raw;
        if (!point) return colors[index % colors.length];
        return searchTerm && !point.isMatch 
          ? 'rgba(255, 255, 255, 0.05)' 
          : colors[index % colors.length];
      },
      pointRadius: (ctx) => {
        const point = ctx.raw;
        if (!point) return 5;
        return searchTerm && point.isMatch ? 8 : 5;
      },
      pointHoverRadius: 8
    };
  });

  const chartData = { datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#cbd5e1', usePointStyle: true }
      },
      title: {
        display: true,
        text: 'Country Classification (ISI vs SBI)',
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
            return `${point.countryName}: (${point.x.toFixed(2)}, ${point.y.toFixed(2)})`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'ISI (Institutional Support Index)',
          color: '#cbd5e1',
          font: { weight: 'bold' }
        },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      },
      y: {
        title: {
          display: true,
          text: 'SBI (Social Bond Index)',
          color: '#cbd5e1',
          font: { weight: 'bold' }
        },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-900/50 rounded-xl border border-indigo-500/20 p-4">
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search Country..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-slate-800 text-white border border-slate-700 rounded px-3 py-1 text-sm focus:outline-none focus:border-indigo-500 w-48"
        />
      </div>
      <div className="flex-grow min-h-0">
        <Scatter data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PCAClassificationChart;
