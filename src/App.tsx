import React, { useState, useEffect } from 'react';
import { Zap, Activity, Gauge, RotateCw, Clock, Wifi } from 'lucide-react';
import { MetricCard } from './components/MetricCard';
import { PieChart } from './components/PieChart';
import { MonitoringTable } from './components/MonitoringTable';
import { LineChart } from './components/LineChart';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [realTimeData, setRealTimeData] = useState({
    voltageR: 210.08,
    currentR: 4.54,
    powerR: 953.76,
    kwhR: 15.23,
    voltageS: 215.32,
    currentS: 4.67,
    powerS: 1005.45,
    kwhS: 16.78,
    voltageT: 208.95,
    currentT: 4.41,
    powerT: 921.33,
    kwhT: 14.89,
    voltage: 211.45,
    current: 4.54,
    power: 960.18,
    cosφ: 0.88
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

  // Generate overall system data (average of R, S, T phases)
  const generateOverallData = () => {
    const times = generateTimeSlots();
    return {
      voltage: times.map(time => ({
        time,
        value: (realTimeData.voltageR + realTimeData.voltageS + realTimeData.voltageT) / 3 + (Math.random() - 0.5) * 10
      })),
      current: times.map(time => ({
        time,
        value: (realTimeData.currentR + realTimeData.currentS + realTimeData.currentT) / 3 + (Math.random() - 0.5) * 0.5
      })),
      power: times.map(time => ({
        time,
        value: (realTimeData.powerR + realTimeData.powerS + realTimeData.powerT) / 3 + (Math.random() - 0.5) * 100
      })),
      kwh: times.map(time => ({
        time,
        value: (realTimeData.kwhR + realTimeData.kwhS + realTimeData.kwhT) / 3 + (Math.random() - 0.5) * 2
      }))
    };
  };

  const [overallSystemData, setOverallSystemData] = useState(generateOverallData());

  // Generate monitoring table data
  const generateMonitoringData = (phaseOffset = 0) => {
    const data = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 10 * 60 * 1000);
      const timeStr = time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      
      data.push({
        time: timeStr,
        voltage: 215 + phaseOffset + (Math.random() - 0.5) * 20,
        current: 4.5 + (Math.random() - 0.5) * 3,
        power: 950 + phaseOffset * 10 + (Math.random() - 0.5) * 600,
        energy: 150 + (Math.random() - 0.5) * 100,
        status: 'Normal'
      });
    }
    
    return data;
  };

  const [monitoringDataR, setMonitoringDataR] = useState(generateMonitoringData(-5));
  const [monitoringDataS, setMonitoringDataS] = useState(generateMonitoringData(0));
  const [monitoringDataT, setMonitoringDataT] = useState(generateMonitoringData(5));

  // Mock pie chart data
  const pieChartData = [
    { label: 'Phase R', value: (realTimeData.voltageR + realTimeData.currentR + realTimeData.powerR) / 3, color: '#3B82F6', percentage: 33 },
    { label: 'Phase S', value: (realTimeData.voltageS + realTimeData.currentS + realTimeData.powerS) / 3, color: '#F59E0B', percentage: 34 },
    { label: 'Phase T', value: (realTimeData.voltageT + realTimeData.currentT + realTimeData.powerT) / 3, color: '#10B981', percentage: 33 }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Simulate real-time data updates
      setRealTimeData(prev => ({
        voltageR: prev.voltageR + (Math.random() - 0.5) * 2,
        currentR: prev.currentR + (Math.random() - 0.5) * 0.2,
        powerR: prev.powerR + (Math.random() - 0.5) * 20,
        kwhR: prev.kwhR + (Math.random() - 0.5) * 0.1,
        voltageS: prev.voltageS + (Math.random() - 0.5) * 2,
        currentS: prev.currentS + (Math.random() - 0.5) * 0.2,
        powerS: prev.powerS + (Math.random() - 0.5) * 20,
        kwhS: prev.kwhS + (Math.random() - 0.5) * 0.1,
        voltageT: prev.voltageT + (Math.random() - 0.5) * 2,
        currentT: prev.currentT + (Math.random() - 0.5) * 0.2,
        powerT: prev.powerT + (Math.random() - 0.5) * 20,
        kwhT: prev.kwhT + (Math.random() - 0.5) * 0.1,
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
      
      // Update overall system data
      setOverallSystemData(prev => {
        const avgVoltage = (realTimeData.voltageR + realTimeData.voltageS + realTimeData.voltageT) / 3;
        const avgCurrent = (realTimeData.currentR + realTimeData.currentS + realTimeData.currentT) / 3;
        const avgPower = (realTimeData.powerR + realTimeData.powerS + realTimeData.powerT) / 3;
        const avgKwh = (realTimeData.kwhR + realTimeData.kwhS + realTimeData.kwhT) / 3;
        
        return {
          voltage: [...prev.voltage.slice(1), {
            time: newTime,
            value: avgVoltage + (Math.random() - 0.5) * 10
          }],
          current: [...prev.current.slice(1), {
            time: newTime,
            value: avgCurrent + (Math.random() - 0.5) * 0.5
          }],
          power: [...prev.power.slice(1), {
            time: newTime,
            value: avgPower + (Math.random() - 0.5) * 100
          }],
          kwh: [...prev.kwh.slice(1), {
            time: newTime,
            value: avgKwh + (Math.random() - 0.5) * 2
          }]
        };
      });
    }, 30000); // 30 seconds for demo (should be 600000 for real 10 minutes)

    // Update monitoring table data every 10 minutes (30 seconds for demo)
    const monitoringTimer = setInterval(() => {
      const now = new Date();
      const newTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      
      setMonitoringDataR(prev => {
        const newData = [...prev.slice(1), {
          time: newTime,
          voltage: 210 + (Math.random() - 0.5) * 20,
          current: 4.5 + (Math.random() - 0.5) * 3,
          power: 950 + (Math.random() - 0.5) * 600,
          energy: 150 + (Math.random() - 0.5) * 100,
          status: 'Normal'
        }];
        return newData;
      });
      
      setMonitoringDataS(prev => {
        const newData = [...prev.slice(1), {
          time: newTime,
          voltage: 215 + (Math.random() - 0.5) * 20,
          current: 4.5 + (Math.random() - 0.5) * 3,
          power: 960 + (Math.random() - 0.5) * 600,
          energy: 150 + (Math.random() - 0.5) * 100,
          status: 'Normal'
        }];
        return newData;
      });
      
      setMonitoringDataT(prev => {
        const newData = [...prev.slice(1), {
          time: newTime,
          voltage: 220 + (Math.random() - 0.5) * 20,
          current: 4.5 + (Math.random() - 0.5) * 3,
          power: 940 + (Math.random() - 0.5) * 600,
          energy: 150 + (Math.random() - 0.5) * 100,
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
        {/* Phase R Metrics */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Phase R</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Tegangan R"
              value={realTimeData.voltageR.toFixed(2)}
              unit="V"
              icon={Zap}
              color="blue"
              trend={2.3}
            />
            <MetricCard
              title="Arus R"
              value={realTimeData.currentR.toFixed(2)}
              unit="A"
              icon={Activity}
              color="yellow"
              trend={-1.2}
            />
            <MetricCard
              title="Daya R"
              value={realTimeData.powerR.toFixed(2)}
              unit="W"
              icon={Gauge}
              color="purple"
              trend={5.7}
            />
            <MetricCard
              title="kWh R"
              value={realTimeData.kwhR.toFixed(2)}
              unit="kWh"
              icon={RotateCw}
              color="green"
              trend={1.8}
            />
          </div>
        </div>

        {/* Phase S Metrics */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Phase S</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Tegangan S"
              value={realTimeData.voltageS.toFixed(2)}
              unit="V"
              icon={Zap}
              color="blue"
              trend={1.8}
            />
            <MetricCard
              title="Arus S"
              value={realTimeData.currentS.toFixed(2)}
              unit="A"
              icon={Activity}
              color="yellow"
              trend={2.1}
            />
            <MetricCard
              title="Daya S"
              value={realTimeData.powerS.toFixed(2)}
              unit="W"
              icon={Gauge}
              color="purple"
              trend={3.4}
            />
            <MetricCard
              title="kWh S"
              value={realTimeData.kwhS.toFixed(2)}
              unit="kWh"
              icon={RotateCw}
              color="green"
              trend={2.5}
            />
          </div>
        </div>

        {/* Phase T Metrics */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Phase T</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Tegangan T"
              value={realTimeData.voltageT.toFixed(2)}
              unit="V"
              icon={Zap}
              color="blue"
              trend={-0.5}
            />
            <MetricCard
              title="Arus T"
              value={realTimeData.currentT.toFixed(2)}
              unit="A"
              icon={Activity}
              color="yellow"
              trend={1.3}
            />
            <MetricCard
              title="Daya T"
              value={realTimeData.powerT.toFixed(2)}
              unit="W"
              icon={Gauge}
              color="purple"
              trend={-2.1}
            />
            <MetricCard
              title="kWh T"
              value={realTimeData.kwhT.toFixed(2)}
              unit="kWh"
              icon={RotateCw}
              color="green"
              trend={0.9}
            />
          </div>
        </div>

        {/* Overall System Metrics */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Overall System</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </div>

        {/* Overall System Charts */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Overall System Trends</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LineChart
              title="Tegangan (V)"
              data={overallSystemData.voltage}
              color="blue"
              unit="V"
            />
            <LineChart
              title="Arus (A)"
              data={overallSystemData.current}
              color="yellow"
              unit="A"
            />
            <LineChart
              title="Daya (W)"
              data={overallSystemData.power}
              color="purple"
              unit="W"
            />
            <LineChart
              title="kWh"
              data={overallSystemData.kwh}
              color="green"
              unit="kWh"
            />
          </div>
        </div>

        {/* System Parameters Distribution */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Phase Distribution Overview</h2>
            <p className="text-gray-600">Real-time distribution analysis of three-phase electrical parameters</p>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <PieChart title="Phase Distribution" data={pieChartData} />
            </div>
          </div>
        </div>

        {/* Monitoring Tables */}
        <div className="mb-8">
          <div className="space-y-8">
            <MonitoringTable title="PZEM Power Monitoring Phase R" data={monitoringDataR} />
            <MonitoringTable title="PZEM Power Monitoring Phase S" data={monitoringDataS} />
            <MonitoringTable title="PZEM Power Monitoring Phase T" data={monitoringDataT} />
          </div>
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