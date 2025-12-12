import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { processIndicatorDistributionsData } from '../../utils/dataProcessing';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

const IndicatorDistributionsChart = ({ data }) => {
  const distributions = useMemo(() => processIndicatorDistributionsData(data), [data]);

  const indicators = [
    { key: 'GDP_PC', color: '#3B82F6' },
    { key: 'Gini', color: '#EF4444' },
    { key: 'Urbanization', color: '#10B981' },
    { key: 'Fertility', color: '#A855F7' },
    { key: 'Suicide', color: '#F59E0B' },
    { key: 'Social_Protection', color: '#06B6D4' }
  ];

  return (
    <div className="w-full h-full bg-slate-900/50 rounded-xl border border-indigo-500/20 p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-slate-100">
        Distribution of Key Indicators Across Societal Buffer Countries
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {indicators.map(({ key, color }) => {
          const dist = distributions[key];
          if (!dist) return null;

          // Create histogram bins
          const numBins = 8;
          const min = Math.min(...dist.values);
          const max = Math.max(...dist.values);
          const binWidth = (max - min) / numBins;
          const bins = Array(numBins).fill(0);
          const binLabels = [];

          for (let i = 0; i < numBins; i++) {
            const binStart = min + i * binWidth;
            const binEnd = min + (i + 1) * binWidth;
            binLabels.push(`${binStart.toFixed(0)}-${binEnd.toFixed(0)}`);
            
            dist.values.forEach(v => {
              if (v >= binStart && (i === numBins - 1 ? v <= binEnd : v < binEnd)) {
                bins[i]++;
              }
            });
          }

          const chartData = {
            labels: binLabels,
            datasets: [{
              data: bins,
              backgroundColor: color + 'CC',
              borderColor: color,
              borderWidth: 1
            }]
          };

          const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              title: {
                display: true,
                text: dist.label,
                color: '#f1f5f9',
                font: { size: 14, weight: 'bold' }
              },
              annotation: {
                annotations: {
                  meanLine: {
                    type: 'line',
                    xMin: binLabels.findIndex(label => {
                      const [start, end] = label.split('-').map(Number);
                      return dist.mean >= start && dist.mean <= end;
                    }),
                    xMax: binLabels.findIndex(label => {
                      const [start, end] = label.split('-').map(Number);
                      return dist.mean >= start && dist.mean <= end;
                    }),
                    borderColor: '#1f2937',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    label: {
                      content: `Mean: ${dist.mean.toFixed(1)}`,
                      enabled: true,
                      position: 'start',
                      backgroundColor: '#1f2937',
                      color: '#fff',
                      font: { size: 9 }
                    }
                  },
                  medianLine: {
                    type: 'line',
                    xMin: binLabels.findIndex(label => {
                      const [start, end] = label.split('-').map(Number);
                      return dist.median >= start && dist.median <= end;
                    }),
                    xMax: binLabels.findIndex(label => {
                      const [start, end] = label.split('-').map(Number);
                      return dist.median >= start && dist.median <= end;
                    }),
                    borderColor: '#374151',
                    borderWidth: 2,
                    borderDash: [2, 2],
                    label: {
                      content: `Median: ${dist.median.toFixed(1)}`,
                      enabled: true,
                      position: 'end',
                      backgroundColor: '#374151',
                      color: '#fff',
                      font: { size: 9 }
                    }
                  }
                }
              }
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { 
                  color: '#94a3b8',
                  font: { size: 9 },
                  maxRotation: 45,
                  minRotation: 45
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Frequency',
                  color: '#cbd5e1',
                  font: { size: 11 }
                },
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#94a3b8', font: { size: 10 } }
              }
            }
          };

          return (
            <div key={key} className="h-64">
              <Bar data={chartData} options={options} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IndicatorDistributionsChart;
