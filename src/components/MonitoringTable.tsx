import React from "react";

interface MonitoringData {
  time: string;
  voltage: number;
  current: number;
  power: number;
  energy: number;
  status: string;
}

interface MonitoringTableProps {
  title: string;
  data: MonitoringData[];
}

export const MonitoringTable: React.FC<MonitoringTableProps> = ({
  title,
  data,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-black">
          {title} (10-Minute Intervals)
        </h3>
        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
          Simulated Data
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-black">
                Time
              </th>
              <th className="text-left py-3 px-4 font-medium text-black">
                Voltage (V)
              </th>
              <th className="text-left py-3 px-4 font-medium text-black">
                Current (A)
              </th>
              <th className="text-left py-3 px-4 font-medium text-black">
                Power (W)
              </th>
              <th className="text-left py-3 px-4 font-medium text-black">
                Energy (kWh)
              </th>
              <th className="text-left py-3 px-4 font-medium text-black">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="py-3 px-4 text-black font-medium">{row.time}</td>
                <td className="py-3 px-4 text-black">
                  {row.voltage.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-black">
                  {row.current.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-black">{row.power.toFixed(2)}</td>
                <td className="py-3 px-4 text-black">
                  {row.energy.toFixed(2)}
                </td>
                <td className="py-3 px-4">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
