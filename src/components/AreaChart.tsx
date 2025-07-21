import React from 'react';

interface AreaChartProps {
  title: string;
  data: number[];
  color: string;
  height?: number;
}

export const AreaChart: React.FC<AreaChartProps> = ({ 
  title, 
  data, 
  color, 
  height = 200 
}) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  const pathD = `M 0,100 L ${points} L 100,100 Z`;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="relative" style={{ height: height }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="overflow-visible"
        >
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" className="text-gray-800" stopColor="currentColor" stopOpacity="1" />
              <stop offset="100%" className="text-gray-400" stopColor="currentColor" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path
            d={pathD}
            fill={`url(#gradient-${color})`}
            className="drop-shadow-sm"
          />
          <polyline
            points={points}
            fill="none"
            stroke="#374151"
            strokeWidth="0.8"
            className="drop-shadow-sm"
          />
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 mt-2">
          <span>13:04</span>
          <span>13:29</span>
          <span>13:54</span>
          <span>14:19</span>
        </div>
      </div>
    </div>
  );
};