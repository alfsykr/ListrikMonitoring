import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  icon: React.ElementType;
  color: string;
  trend: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  icon: Icon,
  color,
  trend
}) => {
  const getBorderColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'border-blue-500',
      yellow: 'border-yellow-500',
      purple: 'border-purple-500',
      green: 'border-green-500',
      red: 'border-red-500'
    };
    return colorMap[color] || 'border-gray-500';
  };

  const getBgColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-100',
      yellow: 'bg-yellow-100',
      purple: 'bg-purple-100',
      green: 'bg-green-100',
      red: 'bg-red-100'
    };
    return colorMap[color] || 'bg-gray-100';
  };

  const getTextColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'text-blue-600',
      yellow: 'text-yellow-600',
      purple: 'text-purple-600',
      green: 'text-green-600',
      red: 'text-red-600'
    };
    return colorMap[color] || 'text-gray-600';
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${getBorderColorClass(color)} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <div className="flex items-baseline mt-2">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <span className="text-gray-500 text-sm ml-1">{unit}</span>
          </div>
          <div className={`flex items-center mt-2 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <span>{trend >= 0 ? '↗' : '↘'} {Math.abs(trend)}%</span>
          </div>
        </div>
        <div className={`p-3 rounded-full ${getBgColorClass(color)}`}>
          <Icon className={`w-6 h-6 ${getTextColorClass(color)}`} />
        </div>
      </div>
    </div>
  );
};