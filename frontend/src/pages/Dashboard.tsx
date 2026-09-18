import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { SensorDeck } from '../components/dashboard/SensorDeck';
import { RealityGapCard } from '../components/dashboard/RealityGapCard';
import { AiTrustCard } from '../components/dashboard/AiTrustCard';
import { PhysicalTwinCard } from '../components/dashboard/PhysicalTwinCard';
import { EdgeAiModelCard } from '../components/dashboard/EdgeAiModelCard';
import { LiveActivityFeed } from '../components/dashboard/LiveActivityFeed';
import { ValidatedDomainExplainer } from '../components/dashboard/ValidatedDomainExplainer';
import {
  INITIAL_SENSOR_DATA,
  INITIAL_SYSTEM_STATUS,
  INITIAL_REALITY_GAP,
  INITIAL_LOGS,
} from '../mock/mockData';
import type { SensorData } from '../types/sensors';
import type { SystemStatus } from '../types/status';
import type { RealityGapData } from '../types/realityGap';
import type { LogEntry } from '../types/logs';

export const Dashboard: React.FC = () => {
  const [isAnomaly, setIsAnomaly] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'realtime' | '15m' | '1h'>('realtime');
  const [sensors, setSensors] = useState<SensorData>(INITIAL_SENSOR_DATA);
  const [status, setStatus] = useState<SystemStatus>(INITIAL_SYSTEM_STATUS);
  const [realityGap, setRealityGap] = useState<RealityGapData>(INITIAL_REALITY_GAP);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [syncSeconds, setSyncSeconds] = useState<number>(2);

  // Sync timer jitter
  useEffect(() => {
    const interval = setInterval(() => {
      setSyncSeconds((prev) => (prev % 3) + 1);

      if (!isAnomaly) {
        // Subtle ambient fluctuations for live sensation
        setSensors((prev) => ({
          ...prev,
          temperature: +(28.3 + Math.random() * 0.25).toFixed(1),
          vibration: +(0.20 + Math.random() * 0.02).toFixed(2),
          current: +(0.42 + Math.random() * 0.02).toFixed(2),
        }));
      }
    }, 2400);

    return () => clearInterval(interval);
  }, [isAnomaly]);

  const addLog = (
    source: LogEntry['source'],
    message: string,
    type: 'normal' | 'alert' | 'metric' = 'normal',
    tag = 'Live'
  ) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newLog: LogEntry = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: timeStr,
      source,
      message,
      type,
      tag,
    };

    setLogs((prev) => [newLog, ...prev.slice(0, 9)]);
  };

  const toggleScenario = () => {
    const nextState = !isAnomaly;
    setIsAnomaly(nextState);

    if (nextState) {
      // Anomaly State
      setSensors({
        temperature: 36.8,
        vibration: 0.48,
        current: 0.84,
        humidity: 56.0,
        rpm: 1890,
      });
      setRealityGap({
        expected: 0.05,
        observed: 0.314,
        gap: 0.314,
        mahalanobisDistance: 2.18,
        klDivergence: 0.142,
        inBounds: false,
        distributionStatus: 'Out-of-Distribution Drift',
        statusText: 'OUTSIDE VALIDATED DOMAIN',
      });
      setStatus((prev) => ({
        ...prev,
        reality_gap: 0.314,
        trust: 'REJECT',
        trustPercentage: 38.6,
        trustVerdict: 'REDUCED TRUST',
        clampState: 'CLAMP ACTIVATED (<1.2ms)',
      }));

      addLog(
        'EdgeTwin Arbiter',
        'Reality Gap breached 20% limit (31.4%) • Deterministic Clamp Engaged!',
        'alert',
        'CLAMP TRIP'
      );
      addLog(
        'TinyML',
        'Out-of-Distribution divergence detected. AI confidence degraded to 38.6%.',
        'alert',
        'DEGRADED'
      );
    } else {
      // Normal State
      setSensors(INITIAL_SENSOR_DATA);
      setRealityGap(INITIAL_REALITY_GAP);
      setStatus(INITIAL_SYSTEM_STATUS);

      addLog(
        'EdgeTwin Arbiter',
        'Telemetry re-entered validated bounds. Safe operation resumed.',
        'normal',
        'RESTORED'
      );
    }
  };

  return (
    <DashboardLayout
      scenarioActive={isAnomaly}
      onToggleScenario={toggleScenario}
      syncSeconds={syncSeconds}
    >
      <main className="space-y-6">
        {/* SECTION TITLE & STATUS HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-coffee/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-coffee-muted uppercase">
              <span>EdgeTwin Physical-to-Digital Arbiter</span>
              <span>•</span>
              <span className="text-coffee">Rig 04 Live</span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-coffee tracking-tight mt-0.5">
              Command Center
            </h1>
            <p className="text-sm text-coffee-muted mt-0.5">
              Real-time physical machine dynamics vs. TinyML validation manifold.
            </p>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-white/70 border border-coffee/10 rounded-xl self-start sm:self-auto text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveTab('realtime')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'realtime'
                  ? 'bg-coffee text-butter shadow-sm'
                  : 'text-coffee-muted hover:text-coffee'
              }`}
            >
              Real-Time
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('15m')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === '15m'
                  ? 'bg-coffee text-butter font-bold shadow-sm'
                  : 'text-coffee-muted hover:text-coffee'
              }`}
            >
              15m Window
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('1h')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === '1h'
                  ? 'bg-coffee text-butter font-bold shadow-sm'
                  : 'text-coffee-muted hover:text-coffee'
              }`}
            >
              1h Drift
            </button>
          </div>
        </div>

        {/* MAIN ROW 1: TACTILE SENSOR DECK (LEFT) + REALITY GAP & AI TRUST (RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* SENSOR DECK (Cols 1-4) */}
          <div className="lg:col-span-4">
            <SensorDeck sensors={sensors} isAnomaly={isAnomaly} />
          </div>

          {/* REALITY GAP & AI TRUST (Cols 5-12) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <RealityGapCard realityGap={realityGap} isAnomaly={isAnomaly} />
            <AiTrustCard status={status} isAnomaly={isAnomaly} />
          </div>
        </div>

        {/* MAIN ROW 2: PHYSICAL TWIN + MODEL STATUS + LIVE LOGS FEED */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <PhysicalTwinCard isAnomaly={isAnomaly} />
          <EdgeAiModelCard />
          <LiveActivityFeed logs={logs} />
        </div>

        {/* BOTTOM SECTION: VALIDATED DOMAIN EXPLAINER */}
        <ValidatedDomainExplainer />
      </main>
    </DashboardLayout>
  );
};
