import React, { useState, useEffect } from 'react';
import { Zap, Activity, Gauge, RotateCw, Clock, Wifi } from 'lucide-react';
import { MetricCard } from './components/MetricCard';
import { AreaChart } from './components/AreaChart';
import { ParameterTable } from './components/ParameterTable';
import { PieChart } from './components/PieChart';
import { MonitoringTable } from './components/MonitoringTable';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [realTimeData, setRealTimeData] = useState({
    voltage: 210.08,
    current: 4.54,
    power: 953.76,
    cosφ: 0.891
  });

  // Generate time slots for 10-minute intervals
  const generateTimeSlots = (count = 6) => {
    const slots = [];
    const now = new Date();
    for (let i = count - 1; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 10 * 60 * 1000);
      slots.push(time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    }
    return slots;
  };

  // Generate data for each parameter
  const generateParameterData = (baseValue: number, variation: number, precision: number = 1) => {
    const times = generateTimeSlots();
    return times.map(time => ({
      time,
      value: baseValue + (Math.random() - 0.5) * variation
    }));
  };

  const [voltageData, setVoltageData] = useState(generateParameterData(215, 20));
  const [currentData, setCurrentData] = useState(generateParameterData(4.5, 0.8));
  const [powerData, setPowerData] = useState(generateParameterData(950, 200));
  const [cosφData, setCosφData] = useState(generateParameterData(0.88, 0.1));

  // Generate monitoring table data
  const generateMonitoringData = () => {
    const data = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 10 * 60 * 1000);
      const timeStr = time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      
      data.push({
        time: timeStr,
        voltage: 215 + (Math.random() - 0.5) * 20,
        current: 4.5 + (Math.random() - 0.5) * 3,
        power: 950 + (Math.random() - 0.5) * 600,
        energy: 150 + (Math.random() - 0.5) * 100,
        cosφ: 0.8 + Math.random() * 0.2,
        status: 'Normal'
      });
    }
    
    return data;
  };

  const [monitoringData, setMonitoringData] = useState(generateMonitoringData());

  // Mock pie chart data
  const pieChartData = [
    { label: 'Tegangan', value: realTimeData.voltage, color: '#3B82F6', percentage: 36 },
    { label: 'Arus', value: realTimeData.current, color: '#F59E0B', percentage: 28 },
    { label: 'Daya', value: realTimeData.power, color: '#6B7280', percentage: 20 },
    { label: 'Cos φ', value: realTimeData.cosφ, color: '#10B981', percentage: 16 }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Simulate real-time data updates
      setRealTimeData(prev => ({
        voltage: prev.voltage + (Math.random() - 0.5) * 2,
        current: prev.current + (Math.random() - 0.5) * 0.2,
        power: prev.power + (Math.random() - 0.5) * 20,
        cosφ: Math.max(0.7, Math.min(1.0, prev.cosφ + (Math.random() - 0.5) * 0.02))
      }));
    }, 2000);

    // Update historical data every 10 minutes (simulated every 30 seconds for demo)
    const historyTimer = setInterval(() => {
      const now = new Date();
      const newTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      
      // Add new data point and remove oldest (keep only 6 points)
      setVoltageData(prev => {
        const newData = [...prev.slice(1), {
          time: newTime,
          value: 215 + (Math.random() - 0.5) * 20
        }];
        return newData;
      });
      
      setCurrentData(prev => {
        const newData = [...prev.slice(1), {
          time: newTime,
          value: 4.5 + (Math.random() - 0.5) * 0.8
        }];
        return newData;
      });
      
      setPowerData(prev => {
        const newData = [...prev.slice(1), {
          time: newTime,
          value: 950 + (Math.random() - 0.5) * 200
        }];
        return newData;
      });
      
      setCosφData(prev => {
        const newData = [...prev.slice(1), {
          time: newTime,
          value: Math.max(0.7, Math.min(1.0, 0.88 + (Math.random() - 0.5) * 0.1))
        }];
        return newData;
      });
    }, 30000); // 30 seconds for demo (should be 600000 for real 10 minutes)

    // Update monitoring table data every 10 minutes (30 seconds for demo)
    const monitoringTimer = setInterval(() => {
      const now = new Date();
      const newTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      
      setMonitoringData(prev => {
        const newData = [...prev.slice(1), {
          time: newTime,
          voltage: 215 + (Math.random() - 0.5) * 20,
          current: 4.5 + (Math.random() - 0.5) * 3,
          power: 950 + (Math.random() - 0.5) * 600,
          energy: 150 + (Math.random() - 0.5) * 100,
          cosφ: 0.8 + Math.random() * 0.2,
          status: 'Normal'
        }];
        return newData;
      });
    }, 30000);

    return () => {
      clearInterval(timer);
      clearInterval(historyTimer);
      clearInterval(monitoringTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Electrical Power Monitoring</h1>
                <p className="text-sm text-gray-600">Real-time monitoring and analysis system</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                {currentTime.toLocaleString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <div className="flex items-center text-sm text-green-600">
                <Wifi className="w-4 h-4 mr-1" />
                Connected
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Tegangan"
            value={realTimeData.voltage.toFixed(2)}
            unit="V"
            icon={Zap}
            color="blue"
            trend={2.3}
          />
          <MetricCard
            title="Arus"
            value={realTimeData.current.toFixed(2)}
            unit="A"
            icon={Activity}
            color="yellow"
            trend={-1.2}
          />
          <MetricCard
            title="Daya"
            value={realTimeData.power.toFixed(2)}
            unit="W"
            icon={Gauge}
            color="purple"
            trend={5.7}
          />
          <MetricCard
            title="Cos φ"
            value={realTimeData.cosφ.toFixed(3)}
            unit=""
            icon={RotateCw}
            color="green"
            trend={1.8}
          />
        </div>

        {/* Parameter Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ParameterTable
            title="Voltage"
            unit="V"
            data={voltageData}
            color="cyan"
            maxValue={240}
            minValue={200}
          />
          <ParameterTable
            title="Current"
            unit="A"
            data={currentData}
            color="yellow"
            maxValue={6}
            minValue={3}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ParameterTable
            title="Power"
            unit="W"
            data={powerData}
            color="blue"
            maxValue={1200}
            minValue={700}
          />
          <ParameterTable
            title="Cos φ"
            unit=""
            data={cosφData}
            color="purple"
            maxValue={1.0}
            minValue={0.7}
          />
        </div>

        {/* System Parameters Distribution */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">System Parameters Distribution</h2>
            <p className="text-gray-600">Real-time distribution analysis of electrical parameters</p>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <PieChart title="Parameter Distribution Overview" data={pieChartData} />
            </div>
          </div>
        </div>

        {/* Monitoring Table */}
        <div className="mb-8">
          <MonitoringTable data={monitoringData} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm text-gray-600">
            © 2025 Electrical Power Monitoring System. Powered by React & Tailwind CSS.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;