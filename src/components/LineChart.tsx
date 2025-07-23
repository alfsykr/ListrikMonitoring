import React from 'react';

interface LineChartProps {
  title: string;
  data: { time: string; value: number }[];
  color: string;
  unit: string;
  height?: number;
}

export const LineChart: React.FC<LineChartProps> = ({ 
  title, 
  data, 
  color, 
  unit,
  height = 200 
}) => {
  const max = Math.max(...data.map(d => d.value));
  const min = Math.min(...data.map(d => d.value));
  const range = max - min || 1;
  
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((item.value - min) / range) * 80; // Use 80% of height for better spacing
    return `${x},${y}`;
  }).join(' ');

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: { stroke: '#3B82F6', fill: 'rgba(59, 130, 246, 0.1)' },
      yellow: { stroke: '#F59E0B', fill: 'rgba(245, 158, 11, 0.1)' },
      purple: { stroke: '#8B5CF6', fill: 'rgba(139, 92, 246, 0.1)' },
      green: { stroke: '#10B981', fill: 'rgba(16, 185, 129, 0.1)' }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const colors = getColorClasses(color);

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
          {/* Grid lines */}
          <defs>
            <pattern id={`grid-${color}`} width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill={`url(#grid-${color})`} />
          
          {/* Area under the line */}
          <path
            d={`M 0,100 L ${points} L 100,100 Z`}
            fill={colors.fill}
          />
          
          {/* Main line */}
          <polyline
            points={points}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="2"
            className="drop-shadow-sm"
          />
          
          {/* Data points */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((item.value - min) / range) * 80;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="1.5"
                fill={colors.stroke}
                className="drop-shadow-sm"
              />
            );
          })}
        </svg>
        
        {/* Time labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 mt-2">
          {data.map((item, index) => (
            <span key={index} className={index % 2 === 0 ? '' : 'hidden sm:block'}>
              {item.time}
            </span>
          ))}
        </div>
        
        {/* Value range */}
        <div className="absolute top-0 right-0 text-xs text-gray-500">
          {max.toFixed(1)} {unit}
        </div>
        <div className="absolute bottom-8 right-0 text-xs text-gray-500">
          {min.toFixed(1)} {unit}
        </div>
      </div>
    </div>
  );
};