import React, { useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

const InequalityTrendChart = () => {
  const [selectedView, setSelectedView] = useState('growth');

  // Theme Colors
  const colors = {
    primary: '#6366f1', // Indigo 500
    primaryLight: '#818cf8', // Indigo 400
    secondary: '#8b5cf6', // Violet 500
    accent: '#f59e0b', // Amber 500
    danger: '#ef4444', // Red 500
    slate: '#64748b', // Slate 500
    success: '#10b981', // Emerald 500
  };

  // Chart 1: Distribution of Country Growth Rates
  const growthDistributionData = {
    labels: ['0', '100', '200', '300', '400', '500', '600', '700', '800', '900', '1000', '1200', '1500', '1800', '2100', '2500'],
    datasets: [{
      label: 'Number of Countries',
      data: [13, 37, 56, 37, 18, 9, 5, 6, 2, 1, 1, 2, 2, 1, 1, 1],
      backgroundColor: (context) => {
        // Highlight bars around the mean/median
        const index = context.dataIndex;
        if (index === 2 || index === 3) return colors.primary; // Around 200-300
        return colors.primaryLight;
      },
      borderRadius: 4,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1
    }]
  };

  const growthOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false }, // Using custom header
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1'
      },
      annotation: {
        annotations: {
          meanLine: {
            type: 'line',
            xMin: 3.65,
            xMax: 3.65,
            borderColor: colors.danger,
            borderWidth: 2,
            borderDash: [6, 4]
          },
          medianLine: {
            type: 'line',
            xMin: 2.78,
            xMax: 2.78,
            borderColor: colors.accent,
            borderWidth: 2,
            borderDash: [6, 4]
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'PPP GNI Growth Rate 1990-2024 (%)',
          color: '#cbd5e1'
        },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      },
      y: {
        title: {
          display: true,
          text: 'Number of Countries',
          color: '#cbd5e1'
        },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      }
    }
  };

  // Chart 2: Top 20 Countries GDP Comparison
  const topGDPTotal = {
    labels: ['China', 'United States', 'India', 'Japan', 'Germany', 'Indonesia', 'Brazil', 'France', 'United Kingdom', 'Turkey', 'South Korea', 'Italy', 'Mexico', 'Canada', 'Iran', 'Spain', 'Saudi Arabia', 'Egypt', 'Australia', 'Pakistan'],
    datasets: [{
      label: 'GDP (Trillion USD)',
      data: [24.27, 20.94, 8.91, 5.06, 4.10, 3.33, 3.22, 2.84, 2.83, 2.30, 2.23, 2.14, 2.10, 1.76, 1.69, 1.66, 1.62, 1.59, 1.55, 1.54],
      backgroundColor: colors.primary,
      borderRadius: 3,
      borderWidth: 0
    }]
  };

  const topGDPPerCapita = {
    labels: ['Qatar', 'Norway', 'Singapore', 'UAE', 'Kuwait', 'Switzerland', 'Ireland', 'United States', 'Luxembourg', 'Australia', 'Denmark', 'Saudi Arabia', 'Oman', 'Netherlands', 'Germany', 'Sweden', 'Canada', 'Austria', 'Finland', 'Belgium'],
    datasets: [{
      label: 'GDP Per Capita (USD)',
      data: [146011, 97603, 92888, 82100, 73242, 72874, 72632, 63051, 56197, 54907, 53741, 49045, 47366, 46685, 46233, 46108, 44017, 43635, 43433, 42658],
      backgroundColor: (context) => {
         const val = context.raw;
         return val > 100000 ? colors.success : colors.primaryLight;
      },
      borderRadius: 3,
      borderWidth: 0
    }]
  };

  const barOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false }, // Handled externally
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
        grid: { display: false },
        ticks: { color: '#cbd5e1', font: { size: 10 } }
      }
    }
  };

  // Chart 3: Wealth Distribution Pie Chart
  const wealthDistribution = {
    labels: ['Top 20%', 'Middle 60%', 'Bottom 20%'],
    datasets: [{
      data: [40.5, 58.3, 1.2],
      backgroundColor: [colors.success, colors.primary, colors.danger],
      borderColor: '#1e293b',
      borderWidth: 2
    }]
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#cbd5e1',
          font: { size: 14 },
          padding: 20
        }
      },
      title: { display: false }, // Handled externally
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        callbacks: {
          label: (context) => `${context.label}: ${context.parsed}%`
        }
      }
    }
  };

  // Render Logic Helpers
  const renderHeader = (title, subtitle = null) => (
    <div className="flex flex-col items-center justify-center mb-4 text-center">
      {/* Helper for Growth Chart specific annotation header */}
      {selectedView === 'growth' && (
         <div className="flex items-center gap-6 mb-2 text-sm font-medium">
            <div className="flex items-center gap-2">
               <div className="w-6 h-0.5 border-t-2 border-dashed border-red-500"></div>
               <span className="text-red-500">Mean: 365%</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-6 h-0.5 border-t-2 border-dashed border-amber-500"></div>
               <span className="text-amber-500">Median: 278%</span>
            </div>
         </div>
      )}
      <h3 className="text-lg font-bold text-slate-100">{title}</h3>
      {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col bg-slate-900/50 rounded-xl border border-indigo-500/20 p-4">
      {/* Selector */}
      <div className="flex justify-end mb-2">
        <select
          value={selectedView}
          onChange={(e) => setSelectedView(e.target.value)}
          className="bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-indigo-500 text-sm"
        >
          <option value="growth">Growth Rate Distribution</option>
          <option value="gdp">Top Countries by GDP</option>
          <option value="gdpPerCapita">Top Countries by GDP Per Capita</option>
          <option value="wealth">Wealth Distribution</option>
        </select>
      </div>

      {/* Chart Display */}
      <div className="flex-grow min-h-0 flex flex-col">
        {selectedView === 'growth' && (
          <>
            {renderHeader('Distribution of Country Growth Rates 1990-2024', '(n=190 countries)')}
            <div className="flex-grow min-h-0">
               <Bar data={growthDistributionData} options={growthOptions} />
            </div>
          </>
        )}
        {selectedView === 'gdp' && (
          <>
            {renderHeader('Top 20 Countries by Total GDP (2020)')}
            <div className="flex-grow min-h-0">
               <Bar data={topGDPTotal} options={barOptions} />
            </div>
          </>
        )}
        {selectedView === 'gdpPerCapita' && (
           <>
            {renderHeader('Top 20 Countries by GDP Per Capita (2020)')}
            <div className="flex-grow min-h-0">
               <Bar data={topGDPPerCapita} options={barOptions} />
            </div>
          </>
        )}
        {selectedView === 'wealth' && (
           <>
            {renderHeader('Global Wealth Distribution')}
            <div className="flex-grow min-h-0">
               <Pie data={wealthDistribution} options={pieOptions} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InequalityTrendChart;
