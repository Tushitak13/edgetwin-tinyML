import React, { useState } from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Motor3DViewer } from '../components/physical-twin/Motor3DViewer';
import { SimulationConsole } from '../components/physical-twin/SimulationConsole';
import { MachineTelemetryStrip } from '../components/physical-twin/MachineTelemetryStrip';
import type { SensorData } from '../types/sensors';
import type { LogEntry } from '../types/logs';
import { INITIAL_SIM_LOGS, SENSOR_BOUNDS } from '../mock/mockData';

export const PhysicalTwin: React.FC = () => {
  const [dataSource, setDataSource] = useState<'hardware' | 'simulation'>('simulation');
  const [sensors, setSensors] = useState<SensorData>({
    temperature: 42.0,
    vibration: 0.42,
    current: 1.80,
    humidity: 55.0,
    rpm: 1820,
  });
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_SIM_LOGS);

  // Reality Gap & Trust calculations based on simulated sensors
  const temp = sensors.temperature;
  const humidity = sensors.humidity;
  const vibe = sensors.vibration;
  const current = sensors.current;

  // Normalized distance across bounds
  const dTemp = Math.max(0, SENSOR_BOUNDS.temp.min - temp, temp - SENSOR_BOUNDS.temp.max) / (SENSOR_BOUNDS.temp.max - SENSOR_BOUNDS.temp.min);
  const dHum = Math.max(0, SENSOR_BOUNDS.humidity.min - humidity, humidity - SENSOR_BOUNDS.humidity.max) / (SENSOR_BOUNDS.humidity.max - SENSOR_BOUNDS.humidity.min);
  const dVibe = Math.max(0, SENSOR_BOUNDS.vibe.min - vibe, vibe - SENSOR_BOUNDS.vibe.max) / (SENSOR_BOUNDS.vibe.max - SENSOR_BOUNDS.vibe.min);
  const dCur = Math.max(0, SENSOR_BOUNDS.current.min - current, current - SENSOR_BOUNDS.current.max) / (SENSOR_BOUNDS.current.max - SENSOR_BOUNDS.current.min);

  let gap = 0.12 + (temp - 35) * 0.0016 + (vibe - 0.2) * 0.055 + (current - 1.0) * 0.02;
  const penalty = dTemp * 0.26 + dHum * 0.12 + dVibe * 0.35 + dCur * 0.27;
  const realityGap = Math.max(0.08, Math.min(0.78, gap + penalty));

  let trustPct = 94.9;
  let trustState: 'TRUSTED' | 'CAUTION' | 'UNTRUSTED • CLAMPED' = 'TRUSTED';
  let clampState = 'ARMED';

  if (realityGap <= 0.2) {
    trustPct = +(98.5 - realityGap * 22).toFixed(1);
    trustState = 'TRUSTED';
    clampState = 'ARMED';
  } else if (realityGap <= 0.4) {
    trustPct = +(86.0 - (realityGap - 0.2) * 80).toFixed(1);
    trustState = 'CAUTION';
    clampState = 'WATCH';
  } else {
    trustPct = Math.max(14.0, +(58.0 - (realityGap - 0.4) * 110).toFixed(1));
    trustState = 'UNTRUSTED • CLAMPED';
    clampState = 'TRIPPED';
  }

  // Dynamic RPM based on conditions
  let calcRpm = Math.round(1820 + temp * 1.4 - current * 32);
  if (vibe > 1.2) calcRpm -= 190;
  if (temp > 85) calcRpm = Math.round(calcRpm * 0.72);
  const currentRpm = Math.max(250, calcRpm);

  const handleUpdateSensors = (updated: Partial<SensorData>) => {
    setSensors((prev) => ({ ...prev, ...updated }));
  };

  const handleAddLog = (message: string, tag: string, type: 'normal' | 'alert' = 'normal') => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newLog: LogEntry = {
      id: `sim-log-${Date.now()}-${Math.random()}`,
      timestamp: timeStr,
      source: 'Simulation Lab',
      message,
      tag,
      type,
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 19)]);
  };

  const handleResetNominal = () => {
    setSensors({
      temperature: 42.0,
      vibration: 0.42,
      current: 1.80,
      humidity: 55.0,
      rpm: 1820,
    });
    handleAddLog(
      'Reset to nominal baseline operating conditions.',
      'NOMINAL',
      'normal'
    );
  };

  return (
    <DashboardLayout
      dataSource={dataSource}
      onToggleDataSource={setDataSource}
    >
      <main className="flex-1 flex flex-col gap-6" data-purpose="primary-workspace">
        {/* SECTION A: PHYSICAL TWIN HEADER */}
        <section
          className="bg-cream-card rounded-3xl p-5 lg:p-6 border border-coffee/15 shadow-warm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden"
          data-purpose="workspace-hero-header"
        >
          <div className="flex flex-col gap-1.5 z-10">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-coffee-deep text-butter font-bold uppercase">
                RIG 04 TWIN
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-butter/40 border border-coffee/15 text-coffee-deep font-semibold">
                HARDWARE-IN-THE-LOOP
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-mint border border-mint-text/20 text-mint-text font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-mint-dot animate-pulse" />
                <span>PHYSICAL ↔ DIGITAL CO-SIMULATION</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-coffee-deep font-sans">
              PHYSICAL TWIN COCKPIT
            </h1>
            <p className="text-coffee/80 text-xs sm:text-sm font-mono">
              Real-time 3D electro-mechanical motor twin synchronized with CMSIS-NN TinyML edge inference.
            </p>
          </div>

          <div className="flex items-center gap-3 z-10 font-mono">
            <div className="bg-[#F5EEDD] p-2.5 px-4 rounded-2xl border border-coffee/15 text-xs flex items-center gap-3 shadow-inner">
              <div className="flex flex-col">
                <span className="text-[10px] text-coffee/60 uppercase">EMULATED RPM</span>
                <span className="font-bold text-coffee-deep text-base">
                  {currentRpm.toLocaleString()}
                </span>
              </div>
              <div className="w-px h-8 bg-coffee/15" />
              <div className="flex flex-col">
                <span className="text-[10px] text-coffee/60 uppercase">SAMPLING</span>
                <span className="font-bold text-coffee-deep text-base">125 Hz</span>
              </div>
              <div className="w-px h-8 bg-coffee/15" />
              <div className="flex flex-col">
                <span className="text-[10px] text-coffee/60 uppercase">CLAMP</span>
                <span
                  className={`font-bold text-base ${
                    clampState === 'TRIPPED'
                      ? 'text-vermilion-pill'
                      : clampState === 'WATCH'
                      ? 'text-butter-dark'
                      : 'text-mint-text'
                  }`}
                >
                  {clampState}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION B: LARGE 3D MOTOR HERO */}
        <Motor3DViewer
          rpm={currentRpm}
          temperature={sensors.temperature}
          vibration={sensors.vibration}
          current={sensors.current}
          humidity={sensors.humidity}
          clampState={clampState}
        />

        {/* SECTION C: INDUSTRIAL CONTROL CONSOLE */}
        <SimulationConsole
          sensors={{ ...sensors, rpm: currentRpm }}
          onUpdateSensors={handleUpdateSensors}
          realityGap={realityGap}
          trustPct={trustPct}
          trustState={trustState}
          logs={logs}
          onAddLog={handleAddLog}
          onResetNominal={handleResetNominal}
        />

        {/* SECTION D: BOTTOM LIVE MACHINE TELEMETRY */}
        <MachineTelemetryStrip sensors={sensors} />
      </main>
    </DashboardLayout>
  );
};
