import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { processRegionalGDPData, getChartColors, formatNumber } from '../../utils/dataProcessing';

const RegionalGDPChart = ({ data }) => {
  const chartData = useMemo(() => {
    const processedData = processRegionalGDPData(data);
    const colors = getChartColors();

    return {
      labels: processedData.map(d => d.region),
      datasets: [
        {
          label: 'Total GDP (Billions)',
          data: processedData.map(d => d.gdp),
          backgroundColor: colors.gradient,
          borderColor: '#0f172a',
          borderWidth: 3,
          hoverBorderColor: '#ffffff',
          hoverBorderWidth: 4,
          hoverOffset: 15,
        }
      ]
    };
  }, [data]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          color: '#cbd5e1',
          font: {
            size: 13,
            family: 'Inter'
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      title: {
        display: true,
        text: 'Regional GDP Distribution (2022)',
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
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            
            return [
              `${label}`,
              `GDP: $${formatNumber(value * 1000000000)}`,
              `Share: ${percentage}%`
            ];
          }
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 2000,
      easing: 'easeInOutQuart'
    },
    cutout: '60%',
  };

  return (
    <div className="h-96 w-full flex items-center justify-center">
      <div className="w-full h-full max-w-2xl">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

export default RegionalGDPChart;
