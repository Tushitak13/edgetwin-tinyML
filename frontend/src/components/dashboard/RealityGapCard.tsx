import React from 'react';
import type { RealityGapData } from '../../types/realityGap';

interface RealityGapCardProps {
  realityGap: RealityGapData;
  isAnomaly: boolean;
}

export const RealityGapCard: React.FC<RealityGapCardProps> = ({ realityGap, isAnomaly }) => {
  // SVG paths for normal vs anomaly
  const normalLine = 'M0,115 L60,112 L120,118 L180,114 L240,110 L300,112 L360,105 L420,108 L480,106 L540,110 L600,108';
  const normalArea = `${normalLine} L600,140 L0,140 Z`;

  const anomalyLine = 'M0,115 L60,112 L120,118 L180,114 L240,110 L300,105 L360,78 L420,45 L480,28 L540,32 L600,26';
  const anomalyArea = `${anomalyLine} L600,140 L0,140 Z`;

  const currentLine = isAnomaly ? anomalyLine : normalLine;
  const currentArea = isAnomaly ? anomalyArea : normalArea;
  const currentCy = isAnomaly ? '26' : '108';

  return (
    <div className="rounded-3xl bg-cream-50 border border-coffee/20 p-6 shadow-card-subtle flex flex-col justify-between relative overflow-hidden">
      {/* Graph Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-coffee/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-butter" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-coffee">
              CENTERPIECE METRIC
            </span>
          </div>
          <h2 className="font-display text-xl font-bold text-coffee mt-0.5">
            REALITY GAP
          </h2>
          <p className="text-xs text-coffee-muted">
            Mathematical divergence between physical dynamics &amp; TinyML validated manifold.
          </p>
        </div>

        {/* Large Value & State Badge */}
        <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-2">
          <div className="flex items-baseline gap-2">
            <span
              className={`font-display text-3xl sm:text-4xl font-extrabold tracking-tight ${
                isAnomaly ? 'text-amber-900' : 'text-coffee'
              }`}
            >
              {(realityGap.gap * 100).toFixed(1)}%
            </span>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold border shadow-sm transition-all flex items-center gap-1.5 ${
              isAnomaly
                ? 'bg-amber-200 text-coffee-deep border-amber-400 animate-pulse'
                : 'bg-emerald-100 text-emerald-900 border-emerald-300'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isAnomaly ? 'bg-amber-600 animate-ping' : 'bg-emerald-600'
              }`}
            />
            <span>{isAnomaly ? 'OUTSIDE VALIDATED DOMAIN' : 'LOW • IN BOUNDS'}</span>
          </div>
        </div>
      </div>

      {/* Dynamic SVG Line Chart */}
      <div className="py-4 relative">
        <div className="flex items-center justify-between text-[11px] font-mono text-coffee-muted mb-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-butter rounded" /> Real-World Gap %
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-b border-dashed border-coffee" /> Validated Threshold (20%)
            </span>
          </div>
          <span>WINDOW: T-30m TO NOW</span>
        </div>

        {/* The Responsive SVG Graph */}
        <div className="w-full h-44 relative bg-cream/40 rounded-2xl border border-coffee/10 p-2">
          <svg
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
            viewBox="0 0 600 140"
          >
            {/* Grid horizontal reference lines */}
            <line stroke="rgba(58, 36, 24, 0.08)" strokeDasharray="3,3" strokeWidth="1" x1="0" x2="600" y1="20" y2="20" />
            <text fill="#7A5B49" fontFamily="monospace" fontSize="9" x="5" y="18">35%</text>

            <line stroke="rgba(58, 36, 24, 0.08)" strokeDasharray="3,3" strokeWidth="1" x1="0" x2="600" y1="50" y2="50" />
            <text fill="#7A5B49" fontFamily="monospace" fontSize="9" x="5" y="48">25%</text>

            {/* Critical Threshold Line (20%) */}
            <line stroke="#3A2418" strokeDasharray="4,4" strokeWidth="1.5" x1="0" x2="600" y1="70" y2="70" />
            <text fill="#3A2418" fontFamily="monospace" fontSize="10" fontWeight="bold" x="430" y="66">
              VALIDATED BOUNDARY (20%)
            </text>

            <line stroke="rgba(58, 36, 24, 0.08)" strokeDasharray="3,3" strokeWidth="1" x1="0" x2="600" y1="100" y2="100" />
            <text fill="#7A5B49" fontFamily="monospace" fontSize="9" x="5" y="98">10%</text>

            {/* Shaded Area beneath curve */}
            <path
              d={currentArea}
              fill={isAnomaly ? 'rgba(226, 91, 62, 0.28)' : 'rgba(244, 211, 94, 0.28)'}
              className="transition-all duration-700"
            />

            {/* Primary Active Graph Line */}
            <path
              d={currentLine}
              fill="none"
              stroke={isAnomaly ? '#E25B3E' : '#F4D35E'}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4.5"
              className="transition-all duration-700"
            />
            <path
              d={currentLine}
              fill="none"
              stroke="#3A2418"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              className="transition-all duration-700"
            />

            {/* Current Live Marker */}
            <circle
              cx="600"
              cy={currentCy}
              fill={isAnomaly ? '#E25B3E' : '#F4D35E'}
              r="6"
              stroke="#3A2418"
              strokeWidth="2"
              className="transition-all duration-700"
            />
          </svg>
        </div>

        {/* Time axis labels */}
        <div className="flex justify-between text-[10px] font-mono text-coffee-muted mt-1 px-1">
          <span>-30 MIN</span>
          <span>-20 MIN</span>
          <span>-10 MIN</span>
          <span>-5 MIN</span>
          <span className="font-bold text-coffee">NOW (LIVE)</span>
        </div>
      </div>

      {/* Bottom Sub-info */}
      <div className="pt-3 border-t border-coffee/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
        <div className="text-coffee-muted">
          Divergence Metric:{' '}
          <span className="font-bold text-coffee font-mono">
            {isAnomaly
              ? 'KL-Divergence = 0.142 > 0.08 Limit (OOD)'
              : 'KL-Divergence = 0.031 < 0.08 Threshold'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isAnomaly ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
            }`}
          />
          <span className="text-coffee font-semibold">
            {isAnomaly
              ? 'Distribution: Out-of-Distribution Drift'
              : 'Distribution: In-Sample Validation'}
          </span>
        </div>
      </div>
    </div>
  );
};
