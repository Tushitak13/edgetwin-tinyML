import React from 'react';
import type { SensorData } from '../../types/sensors';

interface MachineTelemetryStripProps {
  sensors: SensorData;
}

export const MachineTelemetryStrip: React.FC<MachineTelemetryStripProps> = ({ sensors }) => {
  return (
    <section
      className="bg-cream-card rounded-3xl p-5 border border-coffee/15 shadow-warm flex flex-col gap-3"
      data-purpose="bottom-machine-telemetry"
    >
      <div className="flex items-center justify-between border-b border-coffee/10 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-coffee-deep" />
          <h3 className="text-sm font-bold text-coffee-deep font-sans">LIVE MACHINE TELEMETRY</h3>
          <span className="text-coffee/40">|</span>
          <p className="text-[10px] font-mono text-coffee/60">4-Channel Synchronized Curves</p>
        </div>
        <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-coffee-deep text-butter">
          CONTINUOUS 125 Hz
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
        {/* Mini Chart 1: Temp */}
        <div className="bg-[#F6EEDD] p-3 rounded-2xl border border-coffee/15 flex flex-col gap-1 shadow-xs">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-coffee/60 uppercase">Temperature</span>
            <span className="font-bold text-coffee-deep">{sensors.temperature.toFixed(1)} °C</span>
          </div>
          <svg className="w-full h-8 text-coffee-deep" viewBox="0 0 100 24">
            <path
              d="M0 18 Q25 14 50 16 T100 9"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            />
          </svg>
          <span className="text-[8px] text-mint-text font-semibold">
            Manifold Envelope: [35-60°C]
          </span>
        </div>

        {/* Mini Chart 2: Vibe */}
        <div className="bg-[#F6EEDD] p-3 rounded-2xl border border-coffee/15 flex flex-col gap-1 shadow-xs">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-coffee/60 uppercase">Vibration</span>
            <span className="font-bold text-coffee-deep">{sensors.vibration.toFixed(2)} g</span>
          </div>
          <svg className="w-full h-8 text-coffee-deep" viewBox="0 0 100 24">
            <path
              d="M0 12 Q15 4 30 12 T60 12 T90 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            />
          </svg>
          <span className="text-[8px] text-mint-text font-semibold">
            Manifold Envelope: [0.20-0.70g]
          </span>
        </div>

        {/* Mini Chart 3: Current */}
        <div className="bg-[#F6EEDD] p-3 rounded-2xl border border-coffee/15 flex flex-col gap-1 shadow-xs">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-coffee/60 uppercase">Current</span>
            <span className="font-bold text-coffee-deep">{sensors.current.toFixed(2)} A</span>
          </div>
          <svg className="w-full h-8 text-coffee-deep" viewBox="0 0 100 24">
            <path
              d="M0 19 L25 19 L32 6 L45 19 L75 19 L100 19"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            />
          </svg>
          <span className="text-[8px] text-mint-text font-semibold">
            Manifold Envelope: [1.0-3.0A]
          </span>
        </div>

        {/* Mini Chart 4: Humidity */}
        <div className="bg-[#F6EEDD] p-3 rounded-2xl border border-coffee/15 flex flex-col gap-1 shadow-xs">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-coffee/60 uppercase">Humidity</span>
            <span className="font-bold text-coffee-deep">{Math.round(sensors.humidity)} %</span>
          </div>
          <svg className="w-full h-8 text-coffee-deep" viewBox="0 0 100 24">
            <path
              d="M0 13 Q30 11 60 15 T100 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            />
          </svg>
          <span className="text-[8px] text-mint-text font-semibold">
            Manifold Envelope: [40-70%]
          </span>
        </div>
      </div>
    </section>
  );
};
