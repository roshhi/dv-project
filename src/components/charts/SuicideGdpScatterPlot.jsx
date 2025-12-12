import React, { useMemo } from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  LogarithmicScale
} from 'chart.js';
import { processScatterData } from '../../utils/dataProcessing';

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  LogarithmicScale
);

const SuicideGdpScatterPlot = ({ data }) => {
  const scatterData = useMemo(() => processScatterData(data), [data]);

  // Calculate simple linear regression for trend line (on log-transformed X)
  const trendLine = useMemo(() => {
    if (scatterData.length === 0) return [];
    
    const n = scatterData.length;
    const xLog = scatterData.map(d => Math.log10(d.x));
    const y = scatterData.map(d => d.y);
    
    const sumX = xLog.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = xLog.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = xLog.reduce((sum, xi) => sum + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Generate points for line
    const minX = Math.min(...scatterData.map(d => d.x));
    const maxX = Math.max(...scatterData.map(d => d.x));
    
    return [
      { x: minX, y: slope * Math.log10(minX) + intercept },
      { x: maxX, y: slope * Math.log10(maxX) + intercept }
    ];
  }, [scatterData]);

  const chartData = {
    datasets: [
      {
        label: 'Countries',
        data: scatterData,
        backgroundColor: 'rgba(139, 92, 246, 0.6)', // Violet-500
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 1,
        pointRadius: 5,
        pointHoverRadius: 8
      },
      {
        type: 'line',
        label: 'Trend Line',
        data: trendLine,
        borderColor: '#f97316', // Orange-500
        borderWidth: 3,
        pointRadius: 0,
        fill: false,
        tension: 0
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: { color: '#cbd5e1' }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        callbacks: {
          label: (context) => {
            if (context.dataset.type === 'line') return 'Global Trend';
            const point = context.raw;
            return `${point.country}: GDP $${Math.round(point.x).toLocaleString()}, Suicide Rate ${point.y}`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'logarithmic',
        title: {
          display: true,
          text: 'GDP Per Capita (Log Scale)',
          color: '#cbd5e1',
          font: { size: 14, weight: 'bold' }
        },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      },
      y: {
        title: {
          display: true,
          text: 'Suicide Rate (per 100k)',
          color: '#cbd5e1',
          font: { size: 14, weight: 'bold' }
        },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' },
        beginAtZero: true
      }
    }
  };

  return (
    <div className="w-full h-full min-h-[400px] bg-slate-900/50 rounded-xl border border-indigo-500/20 p-4">
      <Scatter data={chartData} options={options} />
    </div>
  );
};

export default SuicideGdpScatterPlot;
