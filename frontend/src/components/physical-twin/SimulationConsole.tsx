import React, { useState } from 'react';
import type { SensorData, SensorPreset } from '../../types/sensors';
import type { LogEntry } from '../../types/logs';
import { SENSOR_BOUNDS, SIMULATION_PRESETS } from '../../mock/mockData';

interface SimulationConsoleProps {
  sensors: SensorData;
  onUpdateSensors: (updated: Partial<SensorData>) => void;
  realityGap: number;
  trustPct: number;
  trustState: 'TRUSTED' | 'CAUTION' | 'UNTRUSTED • CLAMPED';
  logs: LogEntry[];
  onAddLog: (message: string, tag: string, type?: 'normal' | 'alert') => void;
  onResetNominal: () => void;
}

export const SimulationConsole: React.FC<SimulationConsoleProps> = ({
  sensors,
  onUpdateSensors,
  realityGap,
  trustPct,
  trustState,
  logs,
  onAddLog,
  onResetNominal,
}) => {
  const [activePreset, setActivePreset] = useState<string>('nominal');
  const [isRunningSim, setIsRunningSim] = useState<boolean>(false);

  const handlePreset = (presetKey: string) => {
    setActivePreset(presetKey);
    const data: SensorPreset = SIMULATION_PRESETS[presetKey];
    if (!data) return;

    onUpdateSensors({
      temperature: data.temp,
      humidity: data.humidity,
      vibration: data.vibe,
      current: data.current,
    });

    const isUnseen = presetKey === 'unseen';
    onAddLog(
      `Preset loaded: ${presetKey.toUpperCase()} (T:${data.temp}°C, V:${data.vibe}g, I:${data.current}A).`,
      isUnseen ? 'CLAMP TRIP' : 'SYNCED',
      isUnseen ? 'alert' : 'normal'
    );
  };

  const handleStep = (target: keyof SensorData, step: number) => {
    const currentVal = sensors[target] ?? 0;
    const newVal = +(currentVal + step).toFixed(2);
    onUpdateSensors({ [target]: newVal });
    setActivePreset('');
  };

  const handleRunSim = () => {
    setIsRunningSim(true);
    setTimeout(() => {
      setIsRunningSim(false);
      const isOut = realityGap > 0.2;
      onAddLog(
        `Sim-to-Real cycle executed. Reality Gap: ${realityGap.toFixed(2)}. ${
          isOut ? 'EXCEEDS ENVELOPE' : 'Verified within bounds.'
        }`,
        isOut ? 'ALERT' : 'VERIFIED',
        isOut ? 'alert' : 'normal'
      );
    }, 400);
  };

  // Bounds check helper
  const inRange = (val: number, min: number, max: number) => val >= min && val <= max;

  // AI Trust circle circumference calculation (2 * PI * 22 = 138.2)
  const circleCircumference = 138.2;
  const strokeOffset = circleCircumference * (1 - Math.min(100, Math.max(0, trustPct)) / 100);

  // Dynamic pin percentage (0.0 to 0.6 maps to 4% - 96%)
  const pinPct = Math.max(4, Math.min(96, (realityGap / 0.6) * 100));

  // Dynamic curve for reality gap
  const currentY = Math.max(12, 92 - realityGap * 115);
  const pathLine = `M 0 85 Q 80 82, 160 88 T 290 84 L 385 ${currentY.toFixed(1)}`;
  const pathFill = `${pathLine} L 385 100 L 0 100 Z`;

  return (
    <section
      className="bg-coffee-deep text-cream-card rounded-3xl p-6 lg:p-7 border-2 border-coffee-light/40 shadow-console-card flex flex-col gap-6"
      data-purpose="industrial-control-console"
    >
      {/* Console Brand & Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-butter animate-pulse" />
          <div className="flex flex-col">
            <h2 className="text-lg font-black tracking-wider text-butter uppercase font-sans">
              EDGE-HIL SIMULATION &amp; TRUST CONSOLE
            </h2>
            <span className="text-[10px] font-mono text-cream/60">
              INTEGRATED 3-ZONE ARBITER • CMSIS-NN DETERMINISTIC SUPERVISOR
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs bg-black/40 px-3.5 py-1.5 rounded-xl border border-butter/20">
          <span className="text-cream/60">CONDUIT STATUS:</span>
          <span className="text-mint-dot font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-mint-dot animate-ping" />
            <span>HARDWARE IN THE LOOP</span>
          </span>
        </div>
      </div>

      {/* 3-Column Structured Internal Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* COLUMN 1: SIMULATED CONDITIONS (Left, col-span-4) */}
        <div className="lg:col-span-4 bg-coffee-darkcard/80 rounded-2xl p-4 sm:p-5 border border-white/10 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div className="border-b border-white/10 pb-2.5">
              <h3 className="text-sm font-bold text-butter font-sans flex items-center gap-2">
                <span>SIMULATED CONDITIONS</span>
                <span className="w-1.5 h-1.5 rounded-full bg-butter" />
              </h3>
              <p className="text-[11px] font-mono text-cream/70 mt-0.5">
                Control the virtual machine dynamics in real-time.
              </p>
            </div>

            {/* Operating Presets */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cream/60">
                Operating Presets:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { key: 'nominal', label: 'NORMAL' },
                  { key: 'high-load', label: 'HIGH LOAD' },
                  { key: 'high-vibe', label: 'HIGH VIBRATION' },
                  { key: 'overheat', label: 'OVERHEATING' },
                ].map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => handlePreset(p.key)}
                    className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-mono font-bold transition hover:scale-[1.02] text-center ${
                      activePreset === p.key
                        ? 'bg-butter text-coffee-deep border-butter/30 shadow-sm'
                        : 'bg-white/5 text-cream border-white/15 hover:bg-white/10'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handlePreset('unseen')}
                  className={`col-span-2 px-2.5 py-1.5 rounded-xl border text-[11px] font-mono font-bold transition hover:scale-[1.02] text-center flex items-center justify-center gap-1.5 ${
                    activePreset === 'unseen'
                      ? 'bg-vermilion-pill text-cream border-vermilion-pill shadow-sm'
                      : 'border-vermilion-pill/40 bg-vermilion/30 text-vermilion-pill hover:bg-vermilion/40'
                  }`}
                >
                  <span>UNSEEN DOMAIN</span>
                  <span className="text-[9px] text-cream/60">• FAIL-SAFE TRIP</span>
                </button>
              </div>
            </div>

            {/* Precision Sliders */}
            <div className="flex flex-col gap-2.5 mt-1 font-mono">
              {/* Slider 1: Temperature */}
              <div className="bg-black/30 rounded-xl p-2.5 border border-white/10 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-butter" />
                    <span className="text-[11px] font-bold text-butter uppercase">TEMPERATURE</span>
                    <span className="text-[9px] text-cream/50">(20-100°C)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleStep('temperature', -1)}
                      className="w-5 h-5 rounded bg-white/10 hover:bg-butter hover:text-coffee-deep text-cream text-xs font-bold flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="bg-black/60 px-2 py-0.5 rounded border border-white/10 text-xs font-bold text-butter">
                      {sensors.temperature.toFixed(1)} °C
                    </span>
                    <button
                      type="button"
                      onClick={() => handleStep('temperature', 1)}
                      className="w-5 h-5 rounded bg-white/10 hover:bg-butter hover:text-coffee-deep text-cream text-xs font-bold flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="0.5"
                  value={sensors.temperature}
                  onChange={(e) => {
                    onUpdateSensors({ temperature: parseFloat(e.target.value) });
                    setActivePreset('');
                  }}
                  className="my-0.5"
                />
              </div>

              {/* Slider 2: Vibration */}
              <div className="bg-black/30 rounded-xl p-2.5 border border-white/10 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-butter" />
                    <span className="text-[11px] font-bold text-butter uppercase">VIBRATION</span>
                    <span className="text-[9px] text-cream/50">(0.05-2.0 g)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleStep('vibration', -0.05)}
                      className="w-5 h-5 rounded bg-white/10 hover:bg-butter hover:text-coffee-deep text-cream text-xs font-bold flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="bg-black/60 px-2 py-0.5 rounded border border-white/10 text-xs font-bold text-butter">
                      {sensors.vibration.toFixed(2)} g
                    </span>
                    <button
                      type="button"
                      onClick={() => handleStep('vibration', 0.05)}
                      className="w-5 h-5 rounded bg-white/10 hover:bg-butter hover:text-coffee-deep text-cream text-xs font-bold flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="2.00"
                  step="0.01"
                  value={sensors.vibration}
                  onChange={(e) => {
                    onUpdateSensors({ vibration: parseFloat(e.target.value) });
                    setActivePreset('');
                  }}
                  className="my-0.5"
                />
              </div>

              {/* Slider 3: Current Load */}
              <div className="bg-black/30 rounded-xl p-2.5 border border-white/10 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-butter" />
                    <span className="text-[11px] font-bold text-butter uppercase">CURRENT LOAD</span>
                    <span className="text-[9px] text-cream/50">(0.2-5.0 A)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleStep('current', -0.1)}
                      className="w-5 h-5 rounded bg-white/10 hover:bg-butter hover:text-coffee-deep text-cream text-xs font-bold flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="bg-black/60 px-2 py-0.5 rounded border border-white/10 text-xs font-bold text-butter">
                      {sensors.current.toFixed(2)} A
                    </span>
                    <button
                      type="button"
                      onClick={() => handleStep('current', 0.1)}
                      className="w-5 h-5 rounded bg-white/10 hover:bg-butter hover:text-coffee-deep text-cream text-xs font-bold flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="5.0"
                  step="0.05"
                  value={sensors.current}
                  onChange={(e) => {
                    onUpdateSensors({ current: parseFloat(e.target.value) });
                    setActivePreset('');
                  }}
                  className="my-0.5"
                />
              </div>

              {/* Slider 4: Humidity */}
              <div className="bg-black/30 rounded-xl p-2.5 border border-white/10 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-butter" />
                    <span className="text-[11px] font-bold text-butter uppercase">HUMIDITY</span>
                    <span className="text-[9px] text-cream/50">(20-95 %)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleStep('humidity', -1)}
                      className="w-5 h-5 rounded bg-white/10 hover:bg-butter hover:text-coffee-deep text-cream text-xs font-bold flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="bg-black/60 px-2 py-0.5 rounded border border-white/10 text-xs font-bold text-butter">
                      {Math.round(sensors.humidity)} %
                    </span>
                    <button
                      type="button"
                      onClick={() => handleStep('humidity', 1)}
                      className="w-5 h-5 rounded bg-white/10 hover:bg-butter hover:text-coffee-deep text-cream text-xs font-bold flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min="20"
                  max="95"
                  step="1"
                  value={sensors.humidity}
                  onChange={(e) => {
                    onUpdateSensors({ humidity: parseFloat(e.target.value) });
                    setActivePreset('');
                  }}
                  className="my-0.5"
                />
              </div>
            </div>
          </div>

          {/* Functional Action Buttons */}
          <div className="flex flex-col gap-2 pt-2">
            <button
              type="button"
              onClick={handleRunSim}
              className="w-full py-2.5 px-4 rounded-xl bg-butter hover:bg-butter-soft text-coffee-deep font-bold font-mono text-xs tracking-wide shadow-warm transition flex items-center justify-center gap-2 group"
            >
              {isRunningSim ? (
                <>
                  <span>INFERENCE PASS...</span>
                  <span className="w-3.5 h-3.5 border-2 border-coffee-deep border-t-transparent rounded-full animate-spin" />
                </>
              ) : (
                <>
                  <span>RUN SIMULATION</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onResetNominal}
              className="w-full py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-cream/80 font-mono text-xs font-semibold transition"
            >
              RESET NOMINAL
            </button>
          </div>
        </div>

        {/* COLUMN 2: PHYSICAL <-> DIGITAL SYNC & ARBITER (Center, col-span-4) */}
        <div className="lg:col-span-4 bg-coffee-darkcard/80 rounded-2xl p-4 sm:p-5 border border-white/10 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div className="border-b border-white/10 pb-2.5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-butter font-sans">PHYSICAL ↔ DIGITAL</h3>
                <p className="text-[11px] font-mono text-cream/70 mt-0.5">
                  Real-to-sim bilateral parity telemetry.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-mint-dot/20 text-mint-dot border border-mint-dot/40 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-mint-dot animate-pulse" />
                <span>
                  {realityGap > 0.4
                    ? '▲ SHUTOFF ENGAGED'
                    : realityGap > 0.2
                    ? '● DRIFT WARNING'
                    : '● TWIN SYNCHRONIZED'}
                </span>
              </span>
            </div>

            {/* Comparison Readouts Stack */}
            <div className="bg-black/35 rounded-xl p-3 border border-white/10 flex flex-col gap-2 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                <span className="text-cream/60">RPM</span>
                <div className="text-right">
                  <span className="text-cream/40 text-[10px]">PHYSICAL </span>
                  <strong className="text-butter">{sensors.rpm || 1820}</strong>
                  <span className="text-cream/30 mx-1">|</span>
                  <span className="text-cream/40 text-[10px]">DIGITAL </span>
                  <strong className="text-butter">{sensors.rpm || 1820}</strong>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                <span className="text-cream/60">TEMP</span>
                <div className="text-right">
                  <span className="text-cream/40 text-[10px]">PHYSICAL </span>
                  <strong className="text-butter">{sensors.temperature.toFixed(1)}°C</strong>
                  <span className="text-cream/30 mx-1">|</span>
                  <span className="text-cream/40 text-[10px]">DIGITAL </span>
                  <strong className="text-butter">{sensors.temperature.toFixed(1)}°C</strong>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                <span className="text-cream/60">VIBRATION</span>
                <div className="text-right">
                  <span className="text-cream/40 text-[10px]">PHYSICAL </span>
                  <strong className="text-butter">{sensors.vibration.toFixed(2)}g</strong>
                  <span className="text-cream/30 mx-1">|</span>
                  <span className="text-cream/40 text-[10px]">DIGITAL </span>
                  <strong className="text-butter">{sensors.vibration.toFixed(2)}g</strong>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-cream/60">CURRENT</span>
                <div className="text-right">
                  <span className="text-cream/40 text-[10px]">PHYSICAL </span>
                  <strong className="text-butter">{sensors.current.toFixed(2)}A</strong>
                  <span className="text-cream/30 mx-1">|</span>
                  <span className="text-cream/40 text-[10px]">DIGITAL </span>
                  <strong className="text-butter">{sensors.current.toFixed(2)}A</strong>
                </div>
              </div>
            </div>

            {/* AI Trust Status Dial */}
            <div className="bg-black/35 rounded-xl p-3.5 border border-white/10 flex items-center gap-3.5">
              <div className="relative w-14 h-14 flex-shrink-0 flex items-center justify-center">
                <svg className="w-14 h-14 transform -rotate-90">
                  <circle
                    cx="28"
                    cy="28"
                    fill="transparent"
                    r="22"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="4.5"
                  />
                  <circle
                    className="transition-all duration-300"
                    cx="28"
                    cy="28"
                    fill="transparent"
                    r="22"
                    stroke={realityGap > 0.4 ? '#E25B3E' : realityGap > 0.2 ? '#E2BD44' : '#F4D35E'}
                    strokeDasharray="138.2"
                    strokeDashoffset={strokeOffset}
                    strokeLinecap="round"
                    strokeWidth="4.5"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center font-mono">
                  <span className="text-[12px] font-extrabold text-butter">
                    {trustPct.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-cream/60 uppercase">AI TRUST ARBITER</span>
                <span className="text-sm font-extrabold text-cream tracking-tight font-sans flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      realityGap > 0.4
                        ? 'bg-vermilion-pill'
                        : realityGap > 0.2
                        ? 'bg-butter'
                        : 'bg-mint-dot'
                    }`}
                  />
                  <span>{trustState}</span>
                </span>
                <p className="text-[10px] font-mono text-cream/70 leading-tight mt-0.5">
                  {realityGap > 0.4
                    ? 'Model out-of-distribution override! Deterministic clamp triggered actuator shutoff (< 2.5ms).'
                    : realityGap > 0.2
                    ? 'Conditions drifting toward boundary. Elevated uncertainty in CMSIS-NN autoencoder.'
                    : "Current machine conditions remain within the model's validated domain."}
                </p>
              </div>
            </div>
          </div>

          {/* TinyML Inference Specs */}
          <div className="bg-black/40 rounded-xl p-3 border border-white/10 font-mono text-xs flex flex-col gap-1.5">
            <div className="flex justify-between items-center border-b border-white/10 pb-1 text-[10px]">
              <span className="text-cream/50 uppercase">Model:</span>
              <span className="font-bold text-cream">Motor Condition Classifier</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-cream/60">Prediction:</span>
              <span
                className={`font-bold ${
                  realityGap > 0.4
                    ? 'text-vermilion-pill'
                    : realityGap > 0.2
                    ? 'text-butter'
                    : 'text-mint-dot'
                }`}
              >
                {realityGap > 0.4
                  ? 'ANOMALY_CONFIRMED'
                  : realityGap > 0.2
                  ? 'DRIFT_SUSPECTED'
                  : 'NORMAL OPERATION'}
              </span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-cream/60">Confidence:</span>
              <span className="font-bold text-butter">{trustPct.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-cream/60">Latency:</span>
              <span className="font-bold text-cream">~18 ms (Cortex-M4)</span>
            </div>
          </div>
        </div>

        {/* COLUMN 3: REALITY GAP CENTERPIECE (Right, col-span-4) */}
        <div className="lg:col-span-4 bg-coffee-darkcard/80 rounded-2xl p-4 sm:p-5 border border-white/10 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-3">
            {/* Reality Gap Header & Big Metric */}
            <div className="flex items-start justify-between border-b border-white/10 pb-2.5">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-butter" />
                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-cream/60">
                    CENTERPIECE METRIC
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-butter tracking-tight font-sans mt-0.5">
                  REALITY GAP
                </h3>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-3xl font-black font-mono text-butter tracking-tight">
                  {realityGap.toFixed(2)}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border mt-0.5 ${
                    realityGap > 0.4
                      ? 'bg-vermilion/30 text-vermilion-pill border-vermilion-pill/40 animate-pulse'
                      : realityGap > 0.2
                      ? 'bg-amber/30 text-butter border-amber-text/30'
                      : 'bg-mint-dot/20 text-mint-dot border-mint-dot/30'
                  }`}
                >
                  {realityGap > 0.4
                    ? 'CLAMP TRIP • UNSEEN DOMAIN'
                    : realityGap > 0.2
                    ? 'MODERATE • BORDERLINE'
                    : 'LOW GAP • IN BOUNDS'}
                </span>
              </div>
            </div>

            {/* Horizontal Validated Domain Gauge: LOW - MODERATE - HIGH */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between font-mono text-[9px] text-cream/70 font-semibold">
                <span>VALIDATED DOMAIN GAUGE</span>
                <span className="text-butter">
                  {realityGap > 0.4
                    ? 'OUTSIDE VALIDATED DOMAIN'
                    : realityGap > 0.2
                    ? 'BORDERLINE ENVELOPE'
                    : 'NOMINAL ENVELOPE'}
                </span>
              </div>
              <div className="relative w-full h-3 rounded-full bg-black/40 p-0.5 overflow-hidden flex border border-white/15">
                <div className="h-full bg-mint-dot/80 rounded-l-full" style={{ width: '40%' }} title="Low Gap (0.00 - 0.20)" />
                <div className="h-full bg-butter" style={{ width: '25%' }} title="Moderate Gap (0.20 - 0.40)" />
                <div className="h-full bg-vermilion-pill rounded-r-full" style={{ width: '35%' }} title="High Gap (> 0.40)" />
              </div>

              {/* Gauge Pointer Pin */}
              <div className="relative w-full h-3.5 -mt-0.5">
                <div
                  className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center transition-all duration-300"
                  style={{ left: `${pinPct}%` }}
                >
                  <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[5px] border-b-butter" />
                  <span className="text-[8px] font-mono font-bold text-butter">
                    {realityGap.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between font-mono text-[8px] text-cream/40 px-1 -mt-1">
                <span>0.00 (LOW)</span>
                <span>0.20 (LIMIT)</span>
                <span>0.40 (MOD)</span>
                <span>0.60+ (HIGH)</span>
              </div>
            </div>

            {/* Animated Reality Gap Over Time Graph */}
            <div className="w-full bg-black/40 rounded-xl border border-white/10 p-2.5 flex flex-col justify-between relative overflow-hidden h-28">
              <div className="absolute inset-x-2.5 top-2 border-b border-white/5 flex justify-between text-[8px] font-mono text-cream/30">
                <span>0.60</span>
              </div>
              <div className="absolute inset-x-2.5 top-9 border-b-2 border-dashed border-butter/60 flex justify-end">
                <span className="text-[8px] font-mono font-bold text-butter bg-black/80 px-1 -mt-2">
                  VALIDATED BOUNDARY (0.60)
                </span>
              </div>
              <svg className="w-full h-16 mt-2 overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 100">
                <defs>
                  <linearGradient id="consoleGapGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#F4D35E" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#F4D35E" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d={pathFill} fill="url(#consoleGapGrad)" />
                <path
                  d={pathLine}
                  fill="none"
                  stroke={realityGap > 0.4 ? '#E25B3E' : realityGap > 0.2 ? '#E2BD44' : '#F4D35E'}
                  strokeWidth="2.5"
                />
                <circle
                  cx="385"
                  cy={currentY}
                  fill={realityGap > 0.4 ? '#E25B3E' : realityGap > 0.2 ? '#E2BD44' : '#F4D35E'}
                  r="4.5"
                  stroke="#24150F"
                  strokeWidth="2"
                />
              </svg>
              <div className="flex justify-between font-mono text-[8px] text-cream/50 border-t border-white/10 pt-1">
                <span>-30 MIN</span>
                <span>-10 MIN</span>
                <span className="font-bold text-butter">NOW (SIM)</span>
              </div>
            </div>

            {/* Reality Gap Explanation Table */}
            <div className="flex flex-col gap-1 font-mono text-xs bg-black/30 p-2.5 rounded-xl border border-white/10">
              <div className="flex justify-between text-[9px] font-bold text-cream/50 border-b border-white/10 pb-1 uppercase">
                <span>Parameter</span>
                <span>Current / Range</span>
                <span>Status</span>
              </div>
              {/* Temp */}
              <div className="flex items-center justify-between py-0.5 border-b border-white/5 text-[10px]">
                <span className="text-cream/70">Temperature</span>
                <span className="font-bold text-cream">
                  {sensors.temperature.toFixed(1)}°C <span className="font-normal text-cream/40">/ 35–60°C</span>
                </span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[8px] font-bold ${
                    inRange(sensors.temperature, SENSOR_BOUNDS.temp.min, SENSOR_BOUNDS.temp.max)
                      ? 'bg-mint-dot/20 text-mint-dot'
                      : 'bg-vermilion/40 text-vermilion-pill animate-pulse'
                  }`}
                >
                  {inRange(sensors.temperature, SENSOR_BOUNDS.temp.min, SENSOR_BOUNDS.temp.max)
                    ? '✓ WITHIN RANGE'
                    : '! OUTSIDE RANGE'}
                </span>
              </div>
              {/* Vibe */}
              <div className="flex items-center justify-between py-0.5 border-b border-white/5 text-[10px]">
                <span className="text-cream/70">Vibration</span>
                <span className="font-bold text-cream">
                  {sensors.vibration.toFixed(2)}g <span className="font-normal text-cream/40">/ 0.20–0.70g</span>
                </span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[8px] font-bold ${
                    inRange(sensors.vibration, SENSOR_BOUNDS.vibe.min, SENSOR_BOUNDS.vibe.max)
                      ? 'bg-mint-dot/20 text-mint-dot'
                      : 'bg-vermilion/40 text-vermilion-pill animate-pulse'
                  }`}
                >
                  {inRange(sensors.vibration, SENSOR_BOUNDS.vibe.min, SENSOR_BOUNDS.vibe.max)
                    ? '✓ WITHIN RANGE'
                    : '! OUTSIDE RANGE'}
                </span>
              </div>
              {/* Current */}
              <div className="flex items-center justify-between py-0.5 border-b border-white/5 text-[10px]">
                <span className="text-cream/70">Current</span>
                <span className="font-bold text-cream">
                  {sensors.current.toFixed(2)}A <span className="font-normal text-cream/40">/ 1.0–3.0A</span>
                </span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[8px] font-bold ${
                    inRange(sensors.current, SENSOR_BOUNDS.current.min, SENSOR_BOUNDS.current.max)
                      ? 'bg-mint-dot/20 text-mint-dot'
                      : 'bg-vermilion/40 text-vermilion-pill animate-pulse'
                  }`}
                >
                  {inRange(sensors.current, SENSOR_BOUNDS.current.min, SENSOR_BOUNDS.current.max)
                    ? '✓ WITHIN RANGE'
                    : '! OUTSIDE RANGE'}
                </span>
              </div>
              {/* Humidity */}
              <div className="flex items-center justify-between py-0.5 text-[10px]">
                <span className="text-cream/70">Humidity</span>
                <span className="font-bold text-cream">
                  {Math.round(sensors.humidity)}% <span className="font-normal text-cream/40">/ 40–70%</span>
                </span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[8px] font-bold ${
                    inRange(sensors.humidity, SENSOR_BOUNDS.humidity.min, SENSOR_BOUNDS.humidity.max)
                      ? 'bg-mint-dot/20 text-mint-dot'
                      : 'bg-vermilion/40 text-vermilion-pill animate-pulse'
                  }`}
                >
                  {inRange(sensors.humidity, SENSOR_BOUNDS.humidity.min, SENSOR_BOUNDS.humidity.max)
                    ? '✓ WITHIN RANGE'
                    : '! OUTSIDE RANGE'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* INTEGRATED CONSOLE LOWER SECTION: LATEST ACTIVITY LIVE LOG */}
      <div className="bg-black/30 rounded-2xl p-3.5 border border-white/10 flex flex-col gap-2 font-mono" data-purpose="integrated-activity-log">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-mint-dot animate-pulse" />
            <span className="text-xs font-bold text-butter uppercase tracking-wider">
              LATEST ACTIVITY &amp; ARBITER LOG
            </span>
          </div>
          <span className="text-[10px] text-cream/50">TIMESTAMPED REAL-TIME STREAM</span>
        </div>
        <div className="max-h-24 overflow-y-auto space-y-1.5 text-xs custom-scrollbar pr-2" id="sim-logs-container">
          {logs.map((item) => (
            <div
              key={item.id}
              className={`p-1.5 rounded-lg border flex items-center justify-between text-[11px] transition-all duration-200 ${
                item.type === 'alert'
                  ? 'bg-vermilion/20 border-vermilion-pill/30'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <span className="text-cream/80">
                <strong className="text-butter font-semibold">{item.timestamp}</strong> • {item.message}
              </span>
              <span
                className={`text-[10px] font-bold ${
                  item.type === 'alert' ? 'text-vermilion-pill' : 'text-mint-dot'
                }`}
              >
                {item.tag || 'NOMINAL'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
