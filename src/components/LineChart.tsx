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
  
  // Create Y-axis labels (5 levels)
  const yAxisLabels = [];
  for (let i = 0; i < 5; i++) {
    const value = min + (range * (4 - i) / 4);
    yAxisLabels.push(value);
  }
  
  const points = data.map((item, index) => {
    const x = 15 + (index / (data.length - 1)) * 70; // Leave space for Y-axis labels
    const y = 10 + ((max - item.value) / range) * 70; // Invert Y and leave space for padding
    return `${x},${y}`;
  }).join(' ');

  // Create area path
  const areaPoints = data.map((item, index) => {
    const x = 15 + (index / (data.length - 1)) * 70;
    const y = 10 + ((max - item.value) / range) * 70;
    return `${x},${y}`;
  });
  
  const areaPath = `M 15,80 L ${areaPoints.map(p => p).join(' L ')} L 85,80 Z`;

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: { 
        stroke: '#3B82F6', 
        fill: 'rgba(59, 130, 246, 0.2)',
        gradient: 'linear-gradient(180deg, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.05) 100%)'
      },
      yellow: { 
        stroke: '#F59E0B', 
        fill: 'rgba(245, 158, 11, 0.2)',
        gradient: 'linear-gradient(180deg, rgba(245, 158, 11, 0.3) 0%, rgba(245, 158, 11, 0.05) 100%)'
      },
      purple: { 
        stroke: '#8B5CF6', 
        fill: 'rgba(139, 92, 246, 0.2)',
        gradient: 'linear-gradient(180deg, rgba(139, 92, 246, 0.3) 0%, rgba(139, 92, 246, 0.05) 100%)'
      },
      green: { 
        stroke: '#10B981', 
        fill: 'rgba(16, 185, 129, 0.2)',
        gradient: 'linear-gradient(180deg, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0.05) 100%)'
      }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const colors = getColorClasses(color);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="relative" style={{ height: height + 40 }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="overflow-visible"
        >
          {/* Grid lines */}
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colors.stroke} stopOpacity="0.3"/>
              <stop offset="100%" stopColor={colors.stroke} stopOpacity="0.05"/>
            </linearGradient>
          </defs>
          
          {/* Horizontal grid lines */}
          {[0, 1, 2, 3, 4].map(i => (
            <line
              key={i}
              x1="15"
              y1={10 + (i * 17.5)}
              x2="85"
              y2={10 + (i * 17.5)}
              stroke="#f3f4f6"
              strokeWidth="0.5"
            />
          ))}
          
          {/* Vertical grid lines */}
          {data.map((_, index) => (
            <line
              key={index}
              x1={15 + (index / (data.length - 1)) * 70}
              y1="10"
              x2={15 + (index / (data.length - 1)) * 70}
              y2="80"
              stroke="#f3f4f6"
              strokeWidth="0.5"
            />
          ))}
          
          {/* Area under the line */}
          <path
            d={areaPath}
            fill={`url(#gradient-${color})`}
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
            const x = 15 + (index / (data.length - 1)) * 70;
            const y = 10 + ((max - item.value) / range) * 70;
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
        
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-2">
          {yAxisLabels.map((label, index) => (
            <div key={index} className="text-xs text-gray-500 -ml-2">
              {label.toFixed(unit === 'V' ? 0 : unit === 'A' ? 1 : unit === 'W' ? 0 : 1)}
            </div>
          ))}
        </div>
        
        {/* Time labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 mt-2 pl-4 pr-4">
          {data.map((item, index) => (
            <span key={index} className={index % 2 === 0 ? '' : 'hidden sm:block'}>
              {item.time}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};