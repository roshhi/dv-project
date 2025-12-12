import React, { useMemo } from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { processNordicData } from '../../utils/dataProcessing';

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  annotationPlugin
);

const NordicGdpSocialChart = ({ data }) => {
  const { gdpSocialData } = useMemo(() => processNordicData(data), [data]);

  const countryColors = {
    'Denmark': '#3B82F6',   // Blue
    'Finland': '#F97316',   // Orange
    'Iceland': '#10B981',   // Green
    'Norway': '#EF4444',    // Red
    'Sweden': '#A855F7'     // Purple
  };

  const datasets = Object.keys(gdpSocialData).map(country => ({
    label: country,
    data: gdpSocialData[country],
    backgroundColor: countryColors[country],
    borderColor: countryColors[country],
    pointRadius: 6,
    pointHoverRadius: 8
  }));

  // Calculate trend line using linear regression on all data points
  const allPoints = Object.values(gdpSocialData).flat();
  const n = allPoints.length;
  const sumX = allPoints.reduce((sum, p) => sum + p.x, 0);
  const sumY = allPoints.reduce((sum, p) => sum + p.y, 0);
  const sumXY = allPoints.reduce((sum, p) => sum + p.x * p.y, 0);
  const sumX2 = allPoints.reduce((sum, p) => sum + p.x * p.x, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const minX = Math.min(...allPoints.map(p => p.x));
  const maxX = Math.max(...allPoints.map(p => p.x));

  const chartData = {
    datasets: [
      ...datasets,
      {
        label: 'Trend Line',
        type: 'line',
        data: [
          { x: minX, y: slope * minX + intercept },
          { x: maxX, y: slope * maxX + intercept }
        ],
        borderColor: 'rgba(239, 68, 68, 0.6)',
        borderWidth: 2,
        borderDash: [10, 5],
        fill: false,
        pointRadius: 0,
        order: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { 
          color: '#cbd5e1',
          usePointStyle: true,
          padding: 15
        }
      },
      title: {
        display: true,
        text: 'GDP per Capita vs Youth Social Support\nSpearman ρ = -0.564 (p < 0.0001)',
        color: '#f1f5f9',
        font: { size: 16, weight: 'bold' },
        padding: { bottom: 20 }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        callbacks: {
          label: (context) => {
            if (context.dataset.label === 'Trend Line') return null;
            const point = context.raw;
            return `${point.country} (${point.year}): GDP $${Math.round(point.x).toLocaleString()}, Support ${point.y.toFixed(1)}%`;
          }
        }
      },
      annotation: {
        annotations: {
          iceland: {
            type: 'label',
            xValue: 50000,
            yValue: 88.5,
            backgroundColor: 'rgba(16, 185, 129, 0.8)',
            color: '#fff',
            font: { size: 10 },
            padding: 4,
            borderRadius: 4,
            content: ['Iceland', '(Lower GDP,', 'Highest Social Support)'],
            position: 'start'
          },
          norway: {
            type: 'label',
            xValue: 82000,
            yValue: 95,
            backgroundColor: 'rgba(239, 68, 68, 0.8)',
            color: '#fff',
            font: { size: 10 },
            padding: 4,
            borderRadius: 4,
            content: ['Norway', '(Highest GDP,', 'Lower Social Support)'],
            position: 'end'
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'GDP per Capita ($)',
          color: '#cbd5e1',
          font: { weight: 'bold' }
        },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { 
          color: '#94a3b8',
          callback: (value) => `$${(value / 1000).toFixed(0)}k`
        }
      },
      y: {
        title: {
          display: true,
          text: 'Youth Social Support Score (%)',
          color: '#cbd5e1',
          font: { weight: 'bold' }
        },
        min: 95,
        max: 100.5,
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

export default NordicGdpSocialChart;
