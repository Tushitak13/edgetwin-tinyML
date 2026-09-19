import React, { useState } from 'react';
import type { SensorData } from '../../types/sensors';

interface SensorDeckProps {
  sensors: SensorData;
  isAnomaly: boolean;
}

export const SensorDeck: React.FC<SensorDeckProps> = ({ sensors, isAnomaly }) => {
  const [deckOrder, setDeckOrder] = useState<number[]>([0, 1, 2, 3]);

  const cycleDeck = () => {
    setDeckOrder((prev) => {
      const next = [...prev];
      const front = next.shift()!;
      next.push(front);
      return next;
    });
  };

  const setFrontCard = (targetIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeckOrder((prev) => {
      const next = [...prev];
      while (next[0] !== targetIndex) {
        const front = next.shift()!;
        next.push(front);
      }
      return next;
    });
  };

  const getPositionClass = (index: number) => {
    const pos = deckOrder.indexOf(index);
    switch (pos) {
      case 0:
        return 'card-pos-0';
      case 1:
        return 'card-pos-1';
      case 2:
        return 'card-pos-2';
      case 3:
      default:
        return 'card-pos-3';
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-coffee">
            Physical Telemetry Deck
          </h3>
          <p className="text-[11px] text-coffee-muted">Click front card to cycle stack</p>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-butter text-coffee-deep border border-coffee/15">
          4 CHANNELS
        </span>
      </div>

      {/* Stack Container */}
      <div
        className="relative w-full h-[360px] cursor-pointer select-none"
        onClick={cycleDeck}
        title="Click to cycle sensor cards"
      >
        {/* CARD 0: TEMPERATURE */}
        <div
          className={`deck-card ${getPositionClass(0)} absolute inset-x-0 top-0 rounded-3xl bg-cream-50 border border-coffee/20 p-5 flex flex-col justify-between h-[290px]`}
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-orange-100 border border-orange-300 text-orange-900 flex items-center justify-center text-sm font-bold shadow-xs">
                  °C
                </span>
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-coffee">
                    Temperature
                  </span>
                  <div className="text-[10px] text-coffee-muted font-mono">DHT22 • Thermal Drift</div>
                </div>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                  isAnomaly
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}
              >
                {isAnomaly ? 'ELEVATED' : 'STABLE'}
              </span>
            </div>

            {/* Big Value Display */}
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-extrabold text-coffee tracking-tight">
                  {sensors.temperature.toFixed(1)}
                </span>
                <span className="font-mono text-lg font-bold text-coffee-muted">°C</span>
              </div>
              <div className="text-xs font-mono text-coffee-muted mt-0.5 flex items-center gap-1.5">
                <span className={isAnomaly ? 'text-amber-800 font-bold' : 'text-emerald-700 font-bold'}>
                  {isAnomaly ? '↑ +8.4°C SPIKE' : '↑ +0.2°C'}
                </span>
                <span>vs. baseline envelope</span>
              </div>
            </div>
          </div>

          {/* Sparkline Visual */}
          <div className="space-y-2 pt-2 border-t border-coffee/10">
            <div className="flex justify-between text-[10px] font-mono text-coffee-muted">
              <span>HISTORICAL TRACE</span>
              <span className="font-bold text-coffee">NOMINAL 24-32°C</span>
            </div>
            <svg className="w-full h-12 overflow-visible" viewBox="0 0 200 40">
              <path
                d="M0,28 Q30,24 60,26 T120,20 T170,22 L200,21"
                fill="none"
                stroke="#3A2418"
                strokeLinecap="round"
                strokeWidth="2.2"
              />
              <path
                d="M0,28 Q30,24 60,26 T120,20 T170,22 L200,21 L200,40 L0,40 Z"
                fill="rgba(244, 211, 94, 0.25)"
              />
              <circle cx="200" cy="21" fill="#F4D35E" r="3.5" stroke="#3A2418" strokeWidth="2" />
            </svg>
            <div className="text-[10px] font-mono text-center text-coffee-muted">Tap to send to back →</div>
          </div>
        </div>

        {/* CARD 1: VIBRATION */}
        <div
          className={`deck-card ${getPositionClass(1)} absolute inset-x-0 top-0 rounded-3xl bg-cream-50 border border-coffee/20 p-5 flex flex-col justify-between h-[290px]`}
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-butter text-coffee-deep flex items-center justify-center text-xs font-mono font-bold shadow-xs">
                  Hz
                </span>
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-coffee">
                    Vibration
                  </span>
                  <div className="text-[10px] text-coffee-muted font-mono">MPU6050 • 3-Axis Accel</div>
                </div>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                  isAnomaly
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}
              >
                {isAnomaly ? 'SPIKE' : 'NORMAL'}
              </span>
            </div>

            {/* Big Value Display */}
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-extrabold text-coffee tracking-tight">
                  {sensors.vibration.toFixed(2)}
                </span>
                <span className="font-mono text-lg font-bold text-coffee-muted">g</span>
              </div>
              <div className="text-xs font-mono text-coffee-muted mt-0.5 flex items-center gap-1.5">
                <span className={isAnomaly ? 'text-amber-800 font-bold' : 'text-emerald-700 font-bold'}>
                  {isAnomaly ? '+0.27g SPIKE' : '±0.02 g'}
                </span>
                <span>{isAnomaly ? 'Excess Mechanical Jitter' : 'Peak resonance: 142 Hz'}</span>
              </div>
            </div>
          </div>

          {/* Sparkline Visual */}
          <div className="space-y-2 pt-2 border-t border-coffee/10">
            <div className="flex justify-between text-[10px] font-mono text-coffee-muted">
              <span>ACCELEROMETER WAVE</span>
              <span className="font-bold text-coffee">LIMIT: 0.45g</span>
            </div>
            <svg className="w-full h-12 overflow-visible" viewBox="0 0 200 40">
              <path
                d={
                  isAnomaly
                    ? 'M0,20 Q15,4 30,36 T60,4 T90,36 T120,6 T150,34 T180,8 L200,20'
                    : 'M0,20 Q15,10 30,20 T60,20 T90,14 T120,26 T150,18 T180,22 L200,20'
                }
                fill="none"
                stroke={isAnomaly ? '#E25B3E' : '#F4D35E'}
                strokeLinecap="round"
                strokeWidth="2.5"
              />
              <circle cx="200" cy="20" fill="#3A2418" r="3.5" stroke={isAnomaly ? '#E25B3E' : '#F4D35E'} strokeWidth="2" />
            </svg>
            <div className="text-[10px] font-mono text-center text-coffee-muted">Tap to send to back →</div>
          </div>
        </div>

        {/* CARD 2: CURRENT */}
        <div
          className={`deck-card ${getPositionClass(2)} absolute inset-x-0 top-0 rounded-3xl bg-cream-50 border border-coffee/20 p-5 flex flex-col justify-between h-[290px]`}
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center text-xs font-mono font-bold shadow-xs">
                  A
                </span>
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-coffee">
                    Current Draw
                  </span>
                  <div className="text-[10px] text-coffee-muted font-mono">ACS712 • Hall Effect</div>
                </div>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                  isAnomaly
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}
              >
                {isAnomaly ? 'OVERLOAD' : 'STABLE'}
              </span>
            </div>

            {/* Big Value Display */}
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-extrabold text-coffee tracking-tight">
                  {sensors.current.toFixed(2)}
                </span>
                <span className="font-mono text-lg font-bold text-coffee-muted">A</span>
              </div>
              <div className="text-xs font-mono text-coffee-muted mt-0.5 flex items-center gap-1.5">
                <span className={isAnomaly ? 'text-amber-800 font-bold' : 'text-emerald-700 font-bold'}>
                  {isAnomaly ? '~ 4.20 W' : '∼ 2.15 W'}
                </span>
                <span>{isAnomaly ? 'Inductive Saturation' : '5.0V DC Rail'}</span>
              </div>
            </div>
          </div>

          {/* Sparkline Visual */}
          <div className="space-y-2 pt-2 border-t border-coffee/10">
            <div className="flex justify-between text-[10px] font-mono text-coffee-muted">
              <span>PULSE DISCHARGE</span>
              <span className="font-bold text-coffee">MAX: 0.85A</span>
            </div>
            <svg className="w-full h-12 overflow-visible" viewBox="0 0 200 40">
              <path
                d="M0,25 L50,25 L60,12 L70,30 L80,25 L130,25 L140,15 L150,25 L200,25"
                fill="none"
                stroke="#3A2418"
                strokeWidth="2.2"
              />
              <circle cx="200" cy="25" fill="#F4D35E" r="3.5" stroke="#3A2418" strokeWidth="2" />
            </svg>
            <div className="text-[10px] font-mono text-center text-coffee-muted">Tap to send to back →</div>
          </div>
        </div>

        {/* CARD 3: HUMIDITY */}
        <div
          className={`deck-card ${getPositionClass(3)} absolute inset-x-0 top-0 rounded-3xl bg-cream-50 border border-coffee/20 p-5 flex flex-col justify-between h-[290px]`}
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-sky-100 border border-sky-300 text-sky-900 flex items-center justify-center text-xs font-mono font-bold shadow-xs">
                  %
                </span>
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-coffee">
                    Humidity
                  </span>
                  <div className="text-[10px] text-coffee-muted font-mono">DHT22 • Relative RH</div>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                NORMAL
              </span>
            </div>

            {/* Big Value Display */}
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-extrabold text-coffee tracking-tight">
                  {sensors.humidity.toFixed(1)}
                </span>
                <span className="font-mono text-lg font-bold text-coffee-muted">%</span>
              </div>
              <div className="text-xs font-mono text-coffee-muted mt-0.5 flex items-center gap-1.5">
                <span className="text-emerald-700 font-bold">± 1.0%</span>
                <span>Condensation Safe</span>
              </div>
            </div>
          </div>

          {/* Sparkline Visual */}
          <div className="space-y-2 pt-2 border-t border-coffee/10">
            <div className="flex justify-between text-[10px] font-mono text-coffee-muted">
              <span>AMBIENT ENVELOPE</span>
              <span className="font-bold text-coffee">40 - 70%</span>
            </div>
            <svg className="w-full h-12 overflow-visible" viewBox="0 0 200 40">
              <path
                d="M0,22 C40,24 80,18 120,23 C160,28 180,20 200,22"
                fill="none"
                stroke="#3A2418"
                strokeWidth="2.2"
              />
              <circle cx="200" cy="22" fill="#F4D35E" r="3.5" stroke="#3A2418" strokeWidth="2" />
            </svg>
            <div className="text-[10px] font-mono text-center text-coffee-muted">Tap to send to back →</div>
          </div>
        </div>
      </div>

      {/* Stack Quick Navigation Indicators */}
      <div className="flex items-center justify-between px-2 pt-2">
        <span className="text-[11px] font-mono text-coffee-muted">Deck Navigation</span>
        <div className="flex items-center gap-2">
          {[0, 1, 2, 3].map((idx) => {
            const isFront = deckOrder[0] === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={(e) => setFrontCard(idx, e)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  isFront ? 'bg-coffee scale-110' : 'bg-coffee/30 hover:bg-butter'
                }`}
                title={['Temp', 'Vibration', 'Current', 'Humidity'][idx]}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
