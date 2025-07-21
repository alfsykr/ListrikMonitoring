import React from 'react';

interface DataEntry {
  time: string;
  value: number;
}

interface ParameterTableProps {
  title: string;
  unit: string;
  data: DataEntry[];
  color: string;
  maxValue: number;
  minValue: number;
}

export const ParameterTable: React.FC<ParameterTableProps> = ({
  title,
  unit,
  data,
  color,
  maxValue,
  minValue
}) => {
  const getBarHeight = (value: number) => {
    const normalized = ((value - minValue) / (maxValue - minValue)) * 100;
    return Math.max(normalized, 5); // Minimum 5% height
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      cyan: {
        bg: 'bg-gradient-to-t from-cyan-500 to-cyan-300',
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #67e8f9 50%, #a5f3fc 100%)',
        shadow: 'rgba(6, 182, 212, 0.3)',
        top: 'from-cyan-300 to-cyan-200',
        side: 'from-cyan-600 to-cyan-500'
      },
      yellow: {
        bg: 'bg-gradient-to-t from-yellow-500 to-yellow-300',
        gradient: 'linear-gradient(135deg, #eab308 0%, #facc15 50%, #fef3c7 100%)',
        shadow: 'rgba(234, 179, 8, 0.3)',
        top: 'from-yellow-300 to-yellow-200',
        side: 'from-yellow-600 to-yellow-500'
      },
      blue: {
        bg: 'bg-gradient-to-t from-blue-500 to-blue-300',
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #dbeafe 100%)',
        shadow: 'rgba(59, 130, 246, 0.3)',
        top: 'from-blue-300 to-blue-200',
        side: 'from-blue-600 to-blue-500'
      },
      purple: {
        bg: 'bg-gradient-to-t from-purple-500 to-purple-300',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #e9d5ff 100%)',
        shadow: 'rgba(139, 92, 246, 0.3)',
        top: 'from-purple-300 to-purple-200',
        side: 'from-purple-600 to-purple-500'
      }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.cyan;
  };

  const colorClasses = getColorClasses(color);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">
        {title} ({unit})
      </h3>
      
      <div className="overflow-x-auto">
        <div className="flex justify-center">
          <div className="grid grid-cols-6 gap-4 min-w-full">
            {data.map((entry, index) => (
              <div key={index} className="flex flex-col items-center">
                {/* Time Label */}
                <div className="text-xs text-gray-600 mb-2 font-medium">
                  {entry.time}
                </div>
                
                {/* 3D Bar */}
                <div className="relative mb-3" style={{ height: '120px', width: '50px' }}>
                  <div 
                    className="absolute bottom-0 w-full rounded-t-sm shadow-lg transform-gpu transition-all duration-500 hover:scale-105"
                    style={{ 
                      height: `${getBarHeight(entry.value)}%`,
                      background: colorClasses.gradient,
                      boxShadow: `0 4px 12px ${colorClasses.shadow}, inset 0 1px 0 rgba(255, 255, 255, 0.3)`
                    }}
                  >
                    {/* Top face */}
                    <div className={`absolute top-0 left-0 w-full h-3 bg-gradient-to-r ${colorClasses.top} rounded-t-sm`}></div>
                    {/* Right side face */}
                    <div className={`absolute top-0 right-0 w-2 h-full bg-gradient-to-b ${colorClasses.side} rounded-tr-sm`}></div>
                    {/* Highlight */}
                    <div className="absolute top-1 left-1 w-2 h-4 bg-white opacity-30 rounded-sm"></div>
                  </div>
                </div>
                
                {/* Value */}
                <div className="text-sm font-bold text-gray-800 text-center">
                  {entry.value.toFixed(unit === 'V' ? 1 : unit === 'A' ? 2 : unit === 'W' ? 0 : 3)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        Data interval: 10 menit • Range: {minValue.toFixed(1)} - {maxValue.toFixed(1)} {unit}
      </div>
    </div>
  );
};