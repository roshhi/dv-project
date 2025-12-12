import React, { useMemo } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { processCountryProfilesData } from '../../utils/dataProcessing';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const CountryProfilesChart = ({ data }) => {
  const profiles = useMemo(() => processCountryProfilesData(data), [data]);

  const countries = [
    { name: 'Bangladesh', region: 'South Asia', color: 'rgba(59, 130, 246, 0.6)' },
    { name: 'Philippines', region: 'Southeast Asia', color: 'rgba(16, 185, 129, 0.6)' },
    { name: 'Kenya', region: 'Sub-Saharan Africa', color: 'rgba(239, 68, 68, 0.6)' },
    { name: 'Ecuador', region: 'Latin America', color: 'rgba(168, 85, 247, 0.6)' }
  ];

  const dimensions = ['Urbanization', 'Inequality', 'GDP', 'Fertility', 'Suicide Rate', 'Social Protection'];

  return (
    <div className="w-full h-full bg-slate-900/50 rounded-xl border border-indigo-500/20 p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-slate-100">
        Country Profiles: Multi-Dimensional View
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {countries.map(({ name, region, color }) => {
          const profile = profiles[name];
          if (!profile) return null;

          const chartData = {
            labels: dimensions,
            datasets: [{
              label: name,
              data: dimensions.map(dim => profile[dim]),
              backgroundColor: color,
              borderColor: color.replace('0.6', '1'),
              borderWidth: 2,
              pointBackgroundColor: color.replace('0.6', '1'),
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: color.replace('0.6', '1')
            }]
          };

          const options = {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: { display: false },
              title: {
                display: true,
                text: `${name}\n(${region})`,
                color: '#f1f5f9',
                font: { size: 14, weight: 'bold' },
                padding: { bottom: 10 }
              },
              tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                titleColor: '#f1f5f9',
                bodyColor: '#cbd5e1'
              }
            },
            scales: {
              r: {
                angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                pointLabels: {
                  color: '#cbd5e1',
                  font: { size: 11 }
                },
                ticks: {
                  backdropColor: 'transparent',
                  color: '#94a3b8',
                  font: { size: 9 },
                  stepSize: 0.2
                },
                min: 0,
                max: 1
              }
            }
          };

          return (
            <div key={name} className="flex flex-col items-center">
              <div className="w-full max-w-sm h-80">
                <Radar data={chartData} options={options} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CountryProfilesChart;
