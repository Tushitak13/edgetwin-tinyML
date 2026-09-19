import React from 'react';
import type { LogEntry } from '../../types/logs';

interface LiveActivityFeedProps {
  logs: LogEntry[];
}

export const LiveActivityFeed: React.FC<LiveActivityFeedProps> = ({ logs }) => {
  return (
    <div className="md:col-span-4 rounded-3xl bg-cream-50 border border-coffee/20 p-5 shadow-card-subtle flex flex-col justify-between" id="live-logs">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-coffee-deep animate-ping" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-coffee">
              Live Activity Feed
            </h3>
          </div>
          <button type="button" className="text-xs font-mono font-bold text-coffee hover:text-coffee-muted transition-colors">
            VIEW ALL →
          </button>
        </div>

        {/* Feed Container */}
        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {logs.map((log) => (
            <div
              key={log.id}
              className={`p-2.5 rounded-xl border text-xs font-mono space-y-1 log-item-new ${
                log.type === 'alert'
                  ? 'bg-amber-100 text-amber-950 font-bold border-amber-300'
                  : 'bg-white/70 border-coffee/10'
              }`}
            >
              <div className="flex items-center justify-between text-coffee-muted text-[10px]">
                <span className="font-bold text-coffee">
                  {log.timestamp} • {log.source}
                </span>
                <span
                  className={
                    log.type === 'alert'
                      ? 'text-amber-900 font-bold'
                      : log.badgeStyle || 'text-coffee font-bold'
                  }
                >
                  • {log.tag || 'Live'}
                </span>
              </div>
              <div className="text-coffee font-medium">{log.message}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2 mt-2 border-t border-coffee/10 text-[10px] font-mono text-coffee-muted flex items-center justify-between">
        <span>SPI / OLED Buffer: Active</span>
        <span className="text-emerald-700 font-bold">• Stream Live</span>
      </div>
    </div>
  );
};
