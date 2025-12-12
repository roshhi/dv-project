import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { processDevelopmentData, getFilteredChartData } from '../../utils/dataProcessing';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DevelopmentTrendsChart = ({ data }) => {
  const [selectedIndicator, setSelectedIndicator] = useState('Life_Expectancy');

  const processedData = useMemo(() => processDevelopmentData(data), [data]);
  const { years, indicators } = processedData;
  const currentIndicator = indicators[selectedIndicator];

  // Filter data to remove leading nulls/empty years
  const { years: filteredYears, data: filteredData } = useMemo(() => {
    return getFilteredChartData(years, currentIndicator.data);
  }, [years, currentIndicator]);

  const chartData = {
    labels: filteredYears,
    datasets: [
      {
        label: currentIndicator.label,
        data: filteredData,
        borderColor: currentIndicator.color,
        backgroundColor: `${currentIndicator.color}20`, // 20% opacity
        borderWidth: 3,
        pointBackgroundColor: '#1e293b',
        pointBorderColor: currentIndicator.color,
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4, // Smooth curve
        spanGaps: true // Connect points over missing data
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
        text: `Global ${currentIndicator.label} Trend (1960-2022)`,
        color: '#f1f5f9',
        font: {
          size: 18,
          weight: 'bold',
          family: 'Inter'
        },
        padding: 20
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(99, 102, 241, 0.5)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toLocaleString();
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: 'Inter'
          },
          maxTicksLimit: 10
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: 'Inter'
          }
        },
        title: {
          display: true,
          text: currentIndicator.yAxisLabel,
          color: '#cbd5e1',
          font: {
            size: 14,
            family: 'Inter'
          }
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-end mb-4 px-4">
        <select
          value={selectedIndicator}
          onChange={(e) => setSelectedIndicator(e.target.value)}
          className="bg-slate-800 text-slate-200 border border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-inter text-sm"
        >
          {Object.entries(indicators).map(([key, info]) => (
            <option key={key} value={key}>
              {info.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex-grow relative min-h-[400px] bg-slate-900/50 rounded-xl border border-indigo-500/20 p-4">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default DevelopmentTrendsChart;
