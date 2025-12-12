import React, { useMemo } from 'react';
import { processCorrelationData } from '../../utils/dataProcessing';

const CorrelationMatrix = ({ data }) => {
  const { labels, matrix } = useMemo(() => processCorrelationData(data), [data]);

  // Helper to get color based on correlation value
  const getColor = (value) => {
    // -1 (Red) -> 0 (Gray) -> 1 (Blue)
    if (value >= 0) {
      // Blue scale for positive correlation
      const intensity = Math.round(value * 255);
      return `rgba(59, 130, 246, ${Math.abs(value)})`; // Blue-500
    } else {
      // Red scale for negative correlation
      const intensity = Math.round(Math.abs(value) * 255);
      return `rgba(239, 68, 68, ${Math.abs(value)})`; // Red-500
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2">
      <div className="w-full overflow-auto custom-scrollbar">
        <div className="inline-block min-w-max">
          <div className="grid" style={{ 
            gridTemplateColumns: `auto repeat(${labels.length}, minmax(28px, 32px))`,
            gap: '1px'
          }}>
            {/* Header Row */}
            <div className="h-24"></div> {/* Empty corner */}
            {labels.map((label, i) => (
              <div key={`col-${i}`} className="h-24 flex items-end justify-center pb-2">
                <span className="transform -rotate-45 text-[10px] text-slate-400 whitespace-nowrap origin-bottom-left translate-x-3 w-4">
                  {label}
                </span>
              </div>
            ))}

            {/* Data Rows */}
            {matrix.map((row, i) => (
              <React.Fragment key={`row-${i}`}>
                {/* Row Label */}
                <div className="flex items-center justify-end pr-2 h-8">
                  <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{labels[i]}</span>
                </div>
                
                {/* Cells */}
                {row.map((value, j) => (
                  <div
                    key={`cell-${i}-${j}`}
                    className="h-8 w-full flex items-center justify-center rounded-[1px] transition-all hover:scale-125 hover:z-20 relative group cursor-pointer border border-slate-900/10"
                    style={{ backgroundColor: getColor(value) }}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 text-white text-xs p-2 rounded shadow-xl z-30 whitespace-nowrap border border-slate-700 pointer-events-none">
                      <div className="font-bold mb-1">{labels[i]} vs {labels[j]}</div>
                      <div>Correlation: <span className={value > 0 ? 'text-blue-400' : 'text-red-400'}>{value.toFixed(3)}</span></div>
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex items-center gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-20 h-3 bg-gradient-to-r from-red-500 to-transparent"></div>
          <span>Negative Correlation (-1)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-20 h-3 bg-gradient-to-r from-transparent to-blue-500"></div>
          <span>Positive Correlation (+1)</span>
        </div>
      </div>
    </div>
  );
};

export default CorrelationMatrix;
