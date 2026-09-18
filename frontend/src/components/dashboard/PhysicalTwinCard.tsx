import React, { useState, useEffect } from 'react';

interface PhysicalTwinCardProps {
  isAnomaly: boolean;
}

export const PhysicalTwinCard: React.FC<PhysicalTwinCardProps> = ({ isAnomaly }) => {
  const [rotationAngle, setRotationAngle] = useState(0);

  useEffect(() => {
    if (isAnomaly) return;
    const interval = setInterval(() => {
      setRotationAngle((prev) => (prev + 45) % 360);
    }, 600);
    return () => clearInterval(interval);
  }, [isAnomaly]);

  return (
    <div className="md:col-span-4 rounded-3xl bg-cream-50 border border-coffee/20 p-5 shadow-card-subtle flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-coffee" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-coffee">
              Physical Twin
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white text-coffee border border-coffee/15">
            RIG 04
          </span>
        </div>

        {/* Motor Technical Illustration & Status */}
        <div className="flex items-center gap-4 p-3 bg-white/70 rounded-2xl border border-coffee/10">
          <div className="w-16 h-16 rounded-xl bg-coffee-deep text-butter flex items-center justify-center p-2 relative shadow-sm shrink-0">
            <svg
              className="w-10 h-10 transition-transform duration-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ transform: `rotate(${rotationAngle}deg)` }}
            >
              <circle cx="12" cy="12" r="8" strokeWidth="2" />
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeLinecap="round" strokeWidth="2" />
              <circle cx="12" cy="12" fill="#F4D35E" r="2.5" />
            </svg>
            <span
              className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
                isAnomaly ? 'bg-amber-500 animate-ping' : 'bg-emerald-400'
              }`}
            />
          </div>
          <div>
            <div className="text-[11px] font-mono text-coffee-muted uppercase">DC Gear Motor</div>
            <div className="text-sm font-bold text-coffee">TT Dual-Shaft Drive</div>
            <div
              className={`text-xs font-mono font-semibold mt-0.5 ${
                isAnomaly ? 'text-amber-900 font-bold' : 'text-emerald-800'
              }`}
            >
              STATUS: <span>{isAnomaly ? 'CLAMP ENGAGED (TRIPPED)' : 'RUNNING'}</span>
            </div>
          </div>
        </div>

        {/* Machine Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5 mt-3 font-mono">
          <div className="p-2.5 rounded-xl bg-cream/50 border border-coffee/10">
            <div className="text-[10px] text-coffee-muted uppercase">Rotational Speed</div>
            <div className="text-lg font-display font-extrabold text-coffee">
              {isAnomaly ? '1,890' : '1,240'}{' '}
              <span className="text-xs font-mono font-normal">RPM</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-cream/50 border border-coffee/10">
            <div className="text-[10px] text-coffee-muted uppercase">Operating State</div>
            <div
              className={`text-sm font-display font-bold mt-1 ${
                isAnomaly ? 'text-amber-800' : 'text-coffee'
              }`}
            >
              {isAnomaly ? 'ELEVATED WEAR' : 'NORMAL'}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-cream/50 border border-coffee/10">
            <div className="text-[10px] text-coffee-muted uppercase">Power Bus</div>
            <div className="text-sm font-display font-bold text-coffee mt-1">
              {isAnomaly ? '0.0V (CLAMPED)' : '5.0V ON'}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-cream/50 border border-coffee/10">
            <div className="text-[10px] text-coffee-muted uppercase">Microcontroller</div>
            <div className="text-xs font-mono font-bold text-coffee mt-1.5 truncate">
              ESP32 • ONLINE
            </div>
          </div>
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-coffee/10 text-[11px] font-mono text-coffee-muted flex justify-between">
        <span>UART Telemetry</span>
        <span className="text-coffee font-semibold">100 Hz Continuous</span>
      </div>
    </div>
  );
};
