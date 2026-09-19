import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface TopHeaderProps {
  scenarioActive?: boolean;
  onToggleScenario?: () => void;
  dataSource?: 'hardware' | 'simulation';
  onToggleDataSource?: (source: 'hardware' | 'simulation') => void;
  syncSeconds?: number;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  scenarioActive = false,
  onToggleScenario,
  dataSource = 'simulation',
  onToggleDataSource,
  syncSeconds = 2,
}) => {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const isPhysicalTwin = location.pathname === '/physical-twin';

  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-coffee/10 px-4 sm:px-6 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Logo + Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-coffee flex items-center justify-center text-butter font-display font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
            ET
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="font-display font-bold text-xl tracking-tight text-coffee">EDGETWIN</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-coffee/5 text-coffee-muted font-semibold uppercase tracking-wider border border-coffee/10">
              {isPhysicalTwin ? 'Physical Twin' : 'Command Center'}
            </span>
          </div>
        </Link>

        {/* Divider */}
        <div className="h-5 w-px bg-coffee/15 hidden md:block" />

        {/* Live Stream Sub-badge */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-coffee-muted">
          <span className="inline-block w-2 h-2 rounded-full bg-butter animate-pulse shadow-sm" />
          <span className="font-semibold text-coffee">STREAM:</span>
          <span>ESP32-WROOM (115200 baud) → EdgeTwin Runtime</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Physical Twin Data Source Toggle */}
        {isPhysicalTwin && onToggleDataSource && (
          <div className="hidden lg:flex items-center gap-2 font-mono text-xs text-coffee/80 bg-coffee/5 px-3 py-1 rounded-full border border-coffee/10">
            <span className="w-2 h-2 rounded-full bg-butter animate-ping" />
            <span className="font-semibold text-coffee-deep">DATA SOURCE:</span>
            <div className="flex items-center gap-1 bg-coffee-deep/10 p-0.5 rounded-full">
              <button
                type="button"
                onClick={() => onToggleDataSource('hardware')}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition ${
                  dataSource === 'hardware'
                    ? 'bg-coffee-deep text-butter shadow-xs'
                    : 'text-coffee/70 hover:text-coffee-deep'
                }`}
              >
                LIVE HARDWARE
              </button>
              <button
                type="button"
                onClick={() => onToggleDataSource('simulation')}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition flex items-center gap-1 ${
                  dataSource === 'simulation'
                    ? 'bg-coffee-deep text-butter shadow-xs'
                    : 'text-coffee/70 hover:text-coffee-deep'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-butter" />
                <span>SIMULATION</span>
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Demo Scenario Toggle Button */}
        {isDashboard && onToggleScenario && (
          <div className="flex items-center gap-2 bg-white/70 border border-coffee/15 rounded-xl px-2.5 py-1 shadow-sm">
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-coffee-muted hidden sm:inline">
              DEMO SCENARIO
            </span>
            <button
              type="button"
              onClick={onToggleScenario}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all flex items-center gap-2 shadow-sm ${
                scenarioActive
                  ? 'bg-coffee text-butter'
                  : 'bg-butter hover:bg-butter-soft text-coffee-deep'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  scenarioActive ? 'bg-amber-400' : 'bg-coffee'
                }`}
              />
              <span>{scenarioActive ? 'Reset to Normal' : 'Simulate Anomaly (Fault)'}</span>
            </button>
          </div>
        )}

        {/* ESP32 Hardware Status */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 bg-coffee-deep text-cream-100 rounded-xl text-xs font-mono shadow-sm border border-coffee">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold text-butter tracking-wider">ESP32 CONNECTED</span>
          <span className="text-cream/40 text-[10px] hidden sm:inline">|</span>
          <span className="text-cream/80 text-[11px] hidden sm:inline font-medium">
            SYNCED {syncSeconds}s AGO
          </span>
        </div>

        {/* Quick Route Switch Button */}
        <Link
          to={isDashboard ? '/physical-twin' : '/dashboard'}
          className="hidden md:inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl border border-coffee/20 bg-white/60 hover:bg-white text-coffee transition-colors"
        >
          <span>{isDashboard ? 'Twin Cockpit →' : 'Command Center →'}</span>
        </Link>
      </div>
    </header>
  );
};
