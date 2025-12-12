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
import annotationPlugin from 'chartjs-plugin-annotation';
import { processFertilityTrendsData } from '../../utils/dataProcessing';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

const FertilityTrendsChart = ({ data }) => {
  const countriesData = useMemo(() => processFertilityTrendsData(data), [data]);

  const countryColors = {
    'India': '#8B4513',
    'Bangladesh': '#FF6B35',
    'Philippines': '#10B981',
    'Ecuador': '#EF4444',
    'Kenya': '#6366F1',
    'Nigeria': '#A855F7'
  };

  const targetCountries = ['India', 'Bangladesh', 'Philippines', 'Ecuador', 'Kenya', 'Nigeria'];
  
  const datasets = targetCountries
    .filter(country => countriesData[country])
    .map(country => ({
      label: country,
      data: countriesData[country].map(d => ({ x: d.year, y: d.fertility })),
      borderColor: countryColors[country] || '#94a3b8',
      backgroundColor: countryColors[country] || '#94a3b8',
      tension: 0.1,
      borderWidth: 2,
      pointRadius: 3,
      pointHoverRadius: 5
    }));

  const chartData = { datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { color: '#cbd5e1', padding: 10 }
      },
      title: {
        display: true,
        text: 'Fertility Rate Trends: Family Structure Evolution (1990-2020)',
        color: '#f1f5f9',
        font: { size: 18, weight: 'bold' },
        padding: { bottom: 20 }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1'
      },
      annotation: {
        annotations: {
          replacementLine: {
            type: 'line',
            yMin: 2.1,
            yMax: 2.1,
            borderColor: 'rgba(239, 68, 68, 0.7)',
            borderWidth: 2,
            borderDash: [10, 5],
            label: {
              content: 'Replacement Level (2.1)',
              enabled: true,
              position: 'end',
              backgroundColor: 'rgba(239, 68, 68, 0.8)',
              color: '#fff',
              font: { size: 11 }
            }
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear',
        title: {
          display: true,
          text: 'Year',
          color: '#cbd5e1',
          font: { weight: 'bold' }
        },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', stepSize: 5 }
      },
      y: {
        title: {
          display: true,
          text: 'Fertility Rate (Births per Woman)',
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
      <Line data={chartData} options={options} />
    </div>
  );
};

export default FertilityTrendsChart;
