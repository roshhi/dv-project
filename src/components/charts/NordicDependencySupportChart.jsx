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

const NordicDependencySupportChart = ({ data }) => {
  const { dependencySupportData } = useMemo(() => processNordicData(data), [data]);

  const countryColors = {
    'Denmark': '#3B82F6',   // Blue
    'Finland': '#F97316',   // Orange
    'Iceland': '#10B981',   // Green
    'Norway': '#EF4444',    // Red
    'Sweden': '#A855F7'     // Purple
  };

  const datasets = Object.keys(dependencySupportData).map(country => ({
    label: country,
    data: dependencySupportData[country],
    backgroundColor: countryColors[country],
    borderColor: countryColors[country],
    pointRadius: 6,
    pointHoverRadius: 8
  }));

  // Calculate trend line using linear regression
  const allPoints = Object.values(dependencySupportData).flat();
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
        text: 'Dependency Ratio vs Institutional Social Support\nSpearman ρ = -0.734 (p < 0.0001)',
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
            return `${point.country} (${point.year}): Ratio ${point.x.toFixed(1)}%, Support ${point.y.toFixed(1)}%`;
          }
        }
      },
      annotation: {
        annotations: {
          sweden: {
            type: 'label',
            xValue: 4200,
            yValue: 92.5,
            backgroundColor: 'rgba(168, 85, 247, 0.8)',
            color: '#fff',
            font: { size: 10 },
            padding: 4,
            borderRadius: 4,
            content: ['Sweden', '(High Dependency,', 'Low Institutional Support)'],
            position: 'end'
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Dependency Ratio (% - dependents per 100 working-age)',
          color: '#cbd5e1',
          font: { weight: 'bold', size: 11 }
        },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      },
      y: {
        title: {
          display: true,
          text: 'Institutional Social Support Score (%)',
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

export default NordicDependencySupportChart;
