import React from 'react';
import type { SystemStatus } from '../../types/status';

interface AiTrustCardProps {
  status: SystemStatus;
  isAnomaly: boolean;
}

export const AiTrustCard: React.FC<AiTrustCardProps> = ({ status, isAnomaly }) => {
  const percent = isAnomaly ? 38.6 : status.trustPercentage;
  const verdict = isAnomaly ? 'REDUCED TRUST' : status.trustVerdict;
  const clampText = isAnomaly ? 'CLAMP ACTIVATED (<1.2ms)' : status.clampState;

  return (
    <div className="rounded-3xl bg-cream-50 border border-coffee/20 p-5 shadow-card-subtle transition-all">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Circular Confidence Visualizer (Cols 1-4) */}
        <div className="md:col-span-4 flex items-center gap-4">
          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-coffee/10"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              />
              <path
                className={isAnomaly ? 'text-amber-700' : 'text-butter'}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray={`${percent}, 100`}
                strokeLinecap="round"
                strokeWidth="3.8"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-display font-extrabold text-xl text-coffee">
                {percent.toFixed(1)}%
              </span>
              <span className="text-[9px] font-mono text-coffee-muted uppercase">CONFIDENCE</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase font-bold text-coffee-muted">
              EVALUATION
            </div>
            <div className="font-display text-2xl font-bold text-coffee">{verdict}</div>
            <div className="text-xs text-coffee-muted">
              {isAnomaly ? 'Out-of-domain telemetry' : 'Zero hallucination risk'}
            </div>
          </div>
        </div>

        {/* Middle: Model status & fail-safe status (Cols 5-8) */}
        <div className="md:col-span-5 space-y-1.5 border-y md:border-y-0 md:border-x border-coffee/10 py-2 md:py-0 md:px-4 font-mono">
          <div className="text-[10px] uppercase tracking-wider text-coffee-muted font-bold">
            MODEL RUNTIME ARBITER
          </div>
          <div
            className={`text-xs font-semibold flex items-center gap-1.5 ${
              isAnomaly ? 'text-coffee-deep font-bold' : 'text-emerald-800'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isAnomaly ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'
              }`}
            />
            <span>
              {isAnomaly
                ? 'OUT-OF-DISTRIBUTION: DETERMINISTIC CLAMP ENGAGED'
                : 'OPERATING WITHIN VALIDATED DOMAIN'}
            </span>
          </div>
          <p className="text-xs text-coffee-muted font-sans">
            {isAnomaly
              ? 'Physical sensor telemetry diverged past lab envelope bounds. Model actuation clamped.'
              : 'Physical sensor dynamics strictly match offline training manifold. Motor actuators permitted.'}
          </p>
        </div>

        {/* Right: Fail-safe clamp readiness (Cols 9-12) */}
        <div className="md:col-span-3 flex md:flex-col justify-between items-center md:items-end gap-2 text-right">
          <div>
            <div className="text-[10px] font-mono uppercase text-coffee-muted font-bold">
              DETERMINISTIC CLAMP
            </div>
            <div
              className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border mt-1 inline-block ${
                isAnomaly
                  ? 'text-cream-50 bg-coffee border-coffee-deep animate-bounce'
                  : 'text-coffee bg-butter/60 border-coffee/10'
              }`}
            >
              {clampText}
            </div>
          </div>
          <span className="text-[10px] font-mono text-coffee-muted">&lt; 2.5ms shutoff trip</span>
        </div>
      </div>
    </div>
  );
};
