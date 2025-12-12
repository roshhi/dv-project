import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { processGNIPerCapitaData, formatNumber } from '../../utils/dataProcessing';

const PopulationGDPChart = ({ data }) => {
  const chartData = useMemo(() => {
    const processedData = processGNIPerCapitaData(data);

    return {
      labels: processedData.map(d => d.year),
      datasets: [
        {
          label: 'Global GNI Per Capita (PPP)',
          data: processedData.map(d => d.gniPerCapita),
          backgroundColor: 'rgba(236, 72, 153, 0.1)',
          borderColor: 'rgba(236, 72, 153, 1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: 'rgba(236, 72, 153, 1)',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2,
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
        position: 'top',
        labels: {
          color: '#cbd5e1',
          font: {
            size: 14,
            family: 'Inter'
          },
          padding: 20
        }
      },
      title: {
        display: true,
        text: 'Global GNI Per Capita Trend (PPP)',
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
        borderColor: 'rgba(236, 72, 153, 0.5)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          title: function(context) {
            return `Year: ${context[0].label}`;
          },
          label: function(context) {
            const value = context.parsed.y;
            return `GNI Per Capita: $${formatNumber(value)}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Year',
          color: '#cbd5e1',
          font: {
            size: 14,
            family: 'Inter'
          }
        },
        grid: {
          display: false,
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 12,
            family: 'Inter'
          },
          maxTicksLimit: 10
        }
      },
      y: {
        title: {
          display: true,
          text: 'GNI Per Capita (PPP, current international $)',
          color: '#cbd5e1',
          font: {
            size: 14,
            family: 'Inter'
          }
        },
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 12,
            family: 'Inter'
          },
          callback: function(value) {
            return '$' + formatNumber(value);
          }
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    }
  };

  return (
    <div className="h-96 w-full">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PopulationGDPChart;
