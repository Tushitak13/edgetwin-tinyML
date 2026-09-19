import React from 'react';

export const ValidatedDomainExplainer: React.FC = () => {
  return (
    <div className="rounded-3xl bg-coffee text-cream-100 p-6 shadow-card-elevated border border-coffee-deep" id="reality-monitor">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-butter" />
            <span className="text-xs font-mono font-bold tracking-widest text-butter uppercase">
              Training Boundary Specification
            </span>
          </div>
          <h3 className="font-display text-lg font-bold text-cream-50 mt-0.5">
            VALIDATED DOMAIN (WHAT REALITY GAP MEANS)
          </h3>
          <p className="text-xs text-cream/70 mt-0.5">
            Physical envelope tested in lab calibration. Any real-world telemetry escaping these margins triggers the deterministic safety clamp.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-white/10 text-butter font-mono text-xs font-bold border border-white/10">
            SIM-TO-REAL TRUST ACTIVE
          </span>
        </div>
      </div>

      {/* 4 Boundary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 font-mono">
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
          <div className="text-[10px] text-cream/60 uppercase">Temperature Envelope</div>
          <div className="text-lg font-display font-bold text-butter mt-1">20 – 35 °C</div>
          <div className="text-[11px] text-cream/70 mt-0.5">Lab calibrated bounds</div>
        </div>

        <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
          <div className="text-[10px] text-cream/60 uppercase">Vibration Envelope</div>
          <div className="text-lg font-display font-bold text-butter mt-1">0.10 – 0.30 g</div>
          <div className="text-[11px] text-cream/70 mt-0.5">Continuous resonance</div>
        </div>

        <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
          <div className="text-[10px] text-cream/60 uppercase">Current Envelope</div>
          <div className="text-lg font-display font-bold text-butter mt-1">0.30 – 0.70 A</div>
          <div className="text-[11px] text-cream/70 mt-0.5">Nominal load limits</div>
        </div>

        <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
          <div className="text-[10px] text-cream/60 uppercase">Humidity Envelope</div>
          <div className="text-lg font-display font-bold text-butter mt-1">40 – 70 %</div>
          <div className="text-[11px] text-cream/70 mt-0.5">Atmospheric standard</div>
        </div>
      </div>
    </div>
  );
};
