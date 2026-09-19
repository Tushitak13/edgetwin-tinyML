import React from 'react';

export const EdgeAiModelCard: React.FC = () => {
  return (
    <div className="md:col-span-4 rounded-3xl bg-cream-50 border border-coffee/20 p-5 shadow-card-subtle flex flex-col justify-between" id="ai-model">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-butter" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-coffee">
              Edge AI Model
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-butter text-coffee-deep border border-coffee/15">
            ON-CHIP
          </span>
        </div>

        <div className="space-y-3 font-mono">
          <div className="p-3 bg-white/70 rounded-2xl border border-coffee/10">
            <div className="text-[10px] uppercase text-coffee-muted">Loaded Architecture</div>
            <div className="text-sm font-bold text-coffee font-sans">
              EdgeTwin TinyML Autoencoder v1.4
            </div>
            <div className="text-[11px] text-coffee-muted mt-0.5">
              Quantized Int8 • CMSIS-NN
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2.5 rounded-xl bg-cream/50 border border-coffee/10">
              <div className="text-[10px] uppercase text-coffee-muted">Inference Engine</div>
              <div className="text-sm font-bold text-coffee mt-1">ACTIVE</div>
            </div>
            <div className="p-2.5 rounded-xl bg-cream/50 border border-coffee/10">
              <div className="text-[10px] uppercase text-coffee-muted">Cycle Frequency</div>
              <div className="text-sm font-bold text-coffee mt-1">125 Hz</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-cream/50 border border-coffee/10">
            <div className="text-[10px] uppercase text-coffee-muted mb-1">
              Fused Input Channels
            </div>
            <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold">
              <span className="px-2 py-0.5 bg-coffee/5 rounded text-coffee">Vibration</span>
              <span className="px-2 py-0.5 bg-coffee/5 rounded text-coffee">Temperature</span>
              <span className="px-2 py-0.5 bg-coffee/5 rounded text-coffee">Current</span>
              <span className="px-2 py-0.5 bg-coffee/5 rounded text-coffee">Humidity</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-coffee/10 text-[11px] font-mono text-coffee-muted flex justify-between">
        <span>Last Inference</span>
        <span className="text-coffee font-semibold">0.8 sec ago</span>
      </div>
    </div>
  );
};
