import React from 'react';

interface PieChartData {
  label: string;
  value: number;
  color: string;
  percentage: number;
}

interface PieChartProps {
  title: string;
  data: PieChartData[];
}

export const PieChart: React.FC<PieChartProps> = ({ title, data }) => {
  let cumulativePercentage = 0;

  const createSlice = (percentage: number, color: string, startAngle: number) => {
    const angle = (percentage / 100) * 360;
    const endAngle = startAngle + angle;
    
    const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
    const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
    const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
    const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const pathData = [
      `M 50 50`,
      `L ${x1} ${y1}`,
      `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');
    
    return pathData;
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-8 text-center">{title}</h3>
      <div className="flex flex-col items-center">
        <div className="relative">
          <svg width="280" height="280" viewBox="0 0 100 100" className="transform -rotate-90 drop-shadow-lg">
            {data.map((item, index) => {
              const startAngle = cumulativePercentage * 3.6;
              const slice = createSlice(item.percentage, item.color, startAngle);
              cumulativePercentage += item.percentage;
              
              return (
                <path
                  key={index}
                  d={slice}
                  fill={item.color}
                  className="hover:opacity-90 transition-all duration-300 hover:scale-105 transform-gpu"
                  stroke="white"
                  strokeWidth="0.5"
                />
              );
            })}
          </svg>
        </div>
        
        {/* Legend */}
        <div className="grid grid-cols-2 gap-4 mt-8 w-full">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-4 h-4 rounded mr-2 flex-shrink-0"
                style={{ backgroundColor: item.color }}
              ></div>
              <div className="text-sm">
                <div className="font-semibold text-gray-900">{item.label}</div>
                <div className="text-gray-700 font-medium">{item.percentage}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};