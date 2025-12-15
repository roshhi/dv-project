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
import { processDebtTrapData } from '../../utils/dataProcessing';

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DebtTrapChart = ({ data }) => {
  const scatterData = useMemo(() => processDebtTrapData(data), [data]);

  // Calculate linear regression for trend line
  const trendLine = useMemo(() => {
    if (scatterData.length === 0) return [];
    
    const n = scatterData.length;
    const x = scatterData.map(d => d.x);
    const y = scatterData.map(d => d.y);
    
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    const minX = Math.min(...x);
    const maxX = Math.max(...x);
    
    return [
      { x: minX, y: slope * minX + intercept },
      { x: maxX, y: slope * maxX + intercept }
    ];
  }, [scatterData]);

  const chartData = {
    datasets: [
      {
        label: 'Countries',
        data: scatterData,
        backgroundColor: 'rgba(245, 158, 11, 0.6)',
        borderColor: 'rgba(245, 158, 11, 1)',
        pointRadius: 6,
        pointHoverRadius: 9
      },
      {
        type: 'line',
        label: 'Trend Line',
        data: trendLine,
        borderColor: '#EF4444',
        borderWidth: 3,
        borderDash: [5, 5],
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
      title: {
        display: true,
        text: 'Debt Trap: Household Debt vs Economic Output',
        color: '#f1f5f9',
        font: { size: 18, weight: 'bold' }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        callbacks: {
          label: (ctx) => {
            if (ctx.dataset.type === 'line') return 'Trend';
            return `${ctx.raw.country}: GDP $${Math.round(ctx.raw.x).toLocaleString()}, Debt ${ctx.raw.y.toFixed(1)}%`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'GDP Per Capita ($)',
          color: '#cbd5e1',
          font: { weight: 'bold' }
        },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      },
      y: {
        title: {
          display: true,
          text: 'Household Debt to Income (%)',
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

export default DebtTrapChart;
