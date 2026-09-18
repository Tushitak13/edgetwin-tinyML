import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { HardwareRain } from '../components/landing/HardwareRain';

export const LandingPage: React.FC = () => {
  const [isPlayingRain, setIsPlayingRain] = useState<boolean>(true);
  const [stagePhase, setStagePhase] = useState<'initializing' | 'cascading' | 'clearing' | 'settled'>('initializing');

  const triggerReplay = useCallback(() => {
    setIsPlayingRain(false);
    setTimeout(() => {
      setIsPlayingRain(true);
    }, 50);
  }, []);

  const getStageStatusText = () => {
    switch (stagePhase) {
      case 'initializing':
        return 'INITIALIZING BENCH RAIN...';
      case 'cascading':
        return 'COMPONENTS CASCADING...';
      case 'clearing':
        return 'SHOWER CLEARING • MANIFOLD ENGAGED';
      case 'settled':
        return '100% INGESTED • EDGETWIN ACTIVE';
      default:
        return 'INITIALIZING BENCH RAIN...';
    }
  };

  const getBenchTelemetryText = () => {
    switch (stagePhase) {
      case 'initializing':
        return 'STREAMING HARDWARE CASCADE THROUGH VIEWPORT';
      case 'cascading':
        return 'DISPERSING TELEMETRY BUS • REVEALING TWIN';
      case 'clearing':
        return 'HARDWARE INGESTION ALMOST COMPLETE';
      case 'settled':
        return 'HARDWARE SECURED • 100% SECURED IN TWIN RUNTIME';
      default:
        return 'STREAMING HARDWARE CASCADE THROUGH VIEWPORT';
    }
  };

  const getLiveTagText = () => {
    if (stagePhase === 'settled') return 'EDGETWIN OPERATIONAL';
    return 'RAIN SHOWER SEQUENCE';
  };

  return (
    <div className="bg-cream text-coffee-bean font-sans antialiased min-h-screen technical-grid selection:bg-butter-yellow selection:text-deep-espresso flex flex-col justify-between overflow-x-hidden">
      {/* ================= TOP NAVIGATION BAR ================= */}
      <header className="w-full border-b border-coffee-bean/15 bg-cream/92 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 sm:h-18 py-3 flex items-center justify-between">
          {/* Brand Identity */}
          <div className="flex items-center gap-3 sm:gap-4">
            <a className="group flex items-center gap-2.5 sm:gap-3 text-coffee-bean" href="#hero-workbench">
              <div className="w-8 h-8 rounded bg-coffee-bean flex items-center justify-center text-butter-yellow font-mono text-sm font-bold shadow-sm transition-transform group-hover:scale-105 border border-deep-espresso">
                <svg className="w-4 h-4 fill-current text-butter-yellow" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
                </svg>
              </div>
              <div>
                <div className="font-extrabold tracking-tight text-lg sm:text-xl leading-none text-coffee-bean font-mono">
                  EDGETWIN
                </div>
                <div className="text-[9px] tracking-widest font-mono text-muted-coffee uppercase mt-0.5 font-semibold">
                  SIM-TO-REAL TRUST LAYER
                </div>
              </div>
            </a>

            {/* Hardware bench status chip */}
            <div className="hidden lg:flex items-center gap-2 pl-3 ml-2 border-l border-coffee-bean/20">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-oat-cream border border-coffee-bean/15 text-coffee-bean">
                <span className="w-2 h-2 rounded-full bg-butter-yellow animate-ping" />
                <span>{getLiveTagText()}</span>
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-7 text-xs font-mono font-medium tracking-wider text-muted-coffee uppercase">
            <a className="hover:text-coffee-bean transition-colors py-1 hover:border-b-2 hover:border-butter-yellow" href="#hero-workbench">
              BENCH HERO
            </a>
            <a className="hover:text-coffee-bean transition-colors py-1 hover:border-b-2 hover:border-butter-yellow" href="#architecture">
              HOW IT WORKS
            </a>
            <a className="hover:text-coffee-bean transition-colors py-1 hover:border-b-2 hover:border-butter-yellow" href="#comparison">
              BENCHMARKS
            </a>
            <Link className="hover:text-coffee-bean transition-colors py-1 hover:border-b-2 hover:border-butter-yellow" to="/physical-twin">
              PHYSICAL TWIN
            </Link>
          </nav>

          {/* Right Action CTA & Tactile Replay Button */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={triggerReplay}
              className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider uppercase px-3 py-2 rounded border border-coffee-bean/30 text-coffee-bean bg-oat-cream/70 hover:bg-butter-yellow/40 transition-all cursor-pointer"
              title="Replay rainfall hardware shower sequence"
            >
              <span className="material-symbols-outlined text-[14px]">replay</span>
              <span className="hidden sm:inline">REPLAY DROP</span>
            </button>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider uppercase px-4 sm:px-5 py-2.5 rounded bg-coffee-bean text-cream hover:bg-butter-yellow hover:text-coffee-bean transition-all shadow-sm border border-deep-espresso"
            >
              <span>ENTER THE TWIN</span>
              <span className="text-sm font-sans leading-none">→</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ================= HERO SECTION WITH DENSE HARDWARE RAINFALL SHOWER REVEAL ================= */}
      <section className="relative w-full flex flex-col justify-start overflow-hidden border-b border-coffee-bean/25 bg-[#F5EEDB]" id="hero-workbench">
        {/* Hero Canvas Grid lines & Ambient Engineering Vignette */}
        <div className="absolute inset-0 technical-grid-fine opacity-70 pointer-events-none z-0" />
        <div className="absolute inset-0 bg-radial from-transparent via-cream/30 to-cream/80 pointer-events-none z-0" />

        {/* 1. LIVE TELEMETRY STRIP AT TOP */}
        <div className="relative z-30 w-full max-w-7xl mx-auto px-5 sm:px-8 pt-3 pb-2 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono border-b border-coffee-bean/10">
          <div className="flex items-center gap-2 text-muted-coffee">
            <span className="w-2 h-2 rounded-full bg-butter-yellow inline-block animate-pulse" />
            <span className="text-deep-espresso font-bold">STAGE STATUS:</span>
            <span className="text-coffee-bean">{getStageStatusText()}</span>
          </div>
          <div className="flex items-center gap-4 text-muted-coffee">
            <span className="hidden sm:inline">
              DRIFT METRIC: <strong className="text-coffee-bean font-semibold">KL &lt; 0.038</strong>
            </span>
            <span>
              BENCH LATENCY: <strong className="text-coffee-bean font-semibold">1.8ms</strong>
            </span>
            <span className="inline-flex items-center gap-1 text-coffee-bean font-bold bg-soft-butter/80 px-2 py-0.5 rounded border border-coffee-bean/20 text-[10px]">
              {stagePhase === 'settled' ? 'RIG 04 • LIVE' : 'RIG 04 • CASCADING'}
            </span>
          </div>
        </div>

        {/* 2. UPPER / MIDDLE HERO CONTENT AREA WITH RAINFALL SHOWER */}
        <div className="relative w-full flex-1 flex flex-col items-center">
          {/* HARDWARE RAINFALL SHOWER LAYER */}
          <HardwareRain
            isPlaying={isPlayingRain}
            onPhaseChange={setStagePhase}
          />

          {/* CENTERED EDGETWIN HERO CONTENT */}
          <div
            className={`hero-veil-target relative z-20 max-w-7xl mx-auto px-5 sm:px-8 w-full pt-8 pb-10 sm:pt-12 sm:pb-14 flex flex-col items-center text-center ${
              stagePhase === 'settled' || stagePhase === 'clearing'
                ? 'hero-revealed'
                : 'hero-veiled'
            }`}
          >
            {/* Technical Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-cream/95 backdrop-blur-md border border-coffee-bean/20 text-deep-espresso font-mono text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-butter-yellow" />
              <span>SIM-TO-REAL TRUST LAYER FOR TINYML</span>
            </div>

            {/* Large Bold EDGETWIN Headline */}
            <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-tighter text-deep-espresso leading-[0.88] uppercase font-sans drop-shadow-sm select-none">
              EDGE<span className="text-muted-coffee font-light">TWIN</span>
            </h1>

            {/* Supporting Content Card Container */}
            <div className="mt-6 p-6 sm:p-8 rounded-2xl bg-cream/95 backdrop-blur-md border border-coffee-bean/15 shadow-lg max-w-3xl w-full text-center">
              <h2 className="text-base sm:text-xl font-mono font-bold text-coffee-bean tracking-tight uppercase">
                KNOW WHEN YOUR EDGE AI CAN STILL BE TRUSTED.
              </h2>
              <p className="text-xs sm:text-sm text-coffee-bean/80 font-editorial mt-3 leading-relaxed max-w-2xl mx-auto">
                Intelligent edge AI infrastructure connecting physical sensor dynamics with deterministic digital twins to verify model trust in real time. If real-world conditions diverge past training bounds, safe deterministic fallback activates in microseconds.
              </p>

              {/* Action Buttons Row */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 font-mono font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded bg-coffee-bean text-cream hover:bg-butter-yellow hover:text-coffee-bean transition-all shadow-md border border-deep-espresso"
                >
                  <span>ENTER THE TWIN</span>
                  <span className="text-sm leading-none">→</span>
                </Link>
                <a
                  className="inline-flex items-center gap-1.5 font-mono font-bold text-xs uppercase tracking-wider px-5 py-3.5 rounded bg-oat-cream/90 border border-coffee-bean/30 text-coffee-bean hover:bg-cream transition-all"
                  href="#architecture"
                >
                  <span>EXPLORE ARCHITECTURE</span>
                </a>
                <button
                  onClick={triggerReplay}
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase px-4 py-3 rounded border border-coffee-bean/20 text-muted-coffee hover:text-coffee-bean hover:bg-oat-cream transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">replay</span>
                  <span>REPLAY DROP</span>
                </button>
              </div>
            </div>

            {/* The 4 Specification / Stat Cards */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl w-full font-mono text-center">
              <div className="bg-cream/95 backdrop-blur-sm border border-coffee-bean/15 rounded-xl p-3.5 shadow-sm flex flex-col items-center justify-center">
                <span className="block text-deep-espresso font-black text-base sm:text-lg">4.2 μs</span>
                <span className="text-muted-coffee text-[10px] uppercase font-semibold mt-0.5">INFERENCE VERIFY</span>
              </div>
              <div className="bg-cream/95 backdrop-blur-sm border border-coffee-bean/15 rounded-xl p-3.5 shadow-sm flex flex-col items-center justify-center">
                <span className="block text-deep-espresso font-black text-base sm:text-lg">18.4 KB</span>
                <span className="text-muted-coffee text-[10px] uppercase font-semibold mt-0.5">SRAM FOOTPRINT</span>
              </div>
              <div className="bg-cream/95 backdrop-blur-sm border border-coffee-bean/15 rounded-xl p-3.5 shadow-sm flex flex-col items-center justify-center">
                <span className="block text-deep-espresso font-black text-base sm:text-lg">ZERO CLOUD</span>
                <span className="text-muted-coffee text-[10px] uppercase font-semibold mt-0.5">LOCAL AIR-GAPPED</span>
              </div>
              <div className="bg-butter-yellow/35 border border-butter-yellow rounded-xl p-3.5 shadow-sm flex flex-col items-center justify-center">
                <span className="block text-deep-espresso font-black text-base sm:text-lg">100% SAFE</span>
                <span className="text-coffee-bean text-[10px] font-bold uppercase mt-0.5">DETERMINISTIC CLAMP</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. LOWER / END OF HERO SECTION */}
        <div className="relative w-full overflow-hidden bg-coffee-bean border-t-2 border-deep-espresso z-20 shadow-2xl flex flex-col justify-between px-6 sm:px-10 py-3.5" id="benchSurfacePanel">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#FFE89A_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
          <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-soft-butter/60 to-transparent" />

          {/* Hardware Intake Aperture Slot Indicator */}
          <div className="w-full max-w-5xl mx-auto mb-2.5 h-1.5 rounded-full bg-deep-espresso/90 border border-cream/10 shadow-inner flex items-center justify-center overflow-hidden">
            <div className="w-24 h-full bg-butter-yellow/40 animate-pulse" />
          </div>

          {/* Workbench Label Strip */}
          <div className="flex items-center justify-between text-[11px] font-mono text-cream/80 z-10">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded bg-deep-espresso text-soft-butter font-bold border border-coffee-bean/50 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-butter-yellow animate-ping" />
                BENCH SURFACE: LAB RIG 04
              </span>
              <span className="hidden md:inline text-cream/55">PHYSICAL GROUND: 0.0V DC • 5V BUS ACTIVE</span>
            </div>
            <div className="flex items-center gap-4 text-soft-butter font-bold">
              <span className="hidden sm:inline text-cream/60">CYCLE JITTER: &lt; 0.12ms</span>
              <span className="text-butter-yellow font-mono">{getBenchTelemetryText()}</span>
            </div>
          </div>

          {/* Metric Calibrated Engineering Scale */}
          <div className="flex items-end justify-between font-mono text-[9px] text-cream/40 border-t border-cream/15 pt-2 mt-1.5 z-10">
            <span>00cm (BENCH DATUM)</span>
            <span className="hidden sm:inline">15cm</span>
            <span>30cm (SENSOR MATRIX)</span>
            <span className="hidden sm:inline">45cm (MICROCONTROLLER NODE)</span>
            <span>60cm (ACTUATOR TARGET)</span>
            <span className="hidden md:inline">75cm</span>
            <span>90cm (END STOP)</span>
          </div>
        </div>
      </section>

      {/* ================= PROCESS FLOW STRIP ================= */}
      <div className="w-full bg-oat-cream/95 border-b border-coffee-bean/20 py-4 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center text-xs font-mono">
            <div className="p-2.5 rounded bg-cream border border-coffee-bean/10 flex flex-col items-center justify-center">
              <span className="text-[9.5px] text-muted-coffee font-semibold">STAGE 01</span>
              <span className="font-bold text-coffee-bean tracking-wide">PHYSICAL HARDWARE</span>
            </div>
            <div className="p-2.5 rounded bg-cream border border-coffee-bean/10 flex flex-col items-center justify-center">
              <span className="text-[9.5px] text-muted-coffee font-semibold">STAGE 02</span>
              <span className="font-bold text-coffee-bean tracking-wide">SENSOR TELEMETRY</span>
            </div>
            <div className="p-2.5 rounded bg-cream border border-coffee-bean/10 flex flex-col items-center justify-center">
              <span className="text-[9.5px] text-muted-coffee font-semibold">STAGE 03</span>
              <span className="font-bold text-coffee-bean tracking-wide">EDGE AI (TINYML)</span>
            </div>
            <div className="p-2.5 rounded bg-cream border border-coffee-bean/10 flex flex-col items-center justify-center">
              <span className="text-[9.5px] text-muted-coffee font-semibold">STAGE 04</span>
              <span className="font-bold text-coffee-bean tracking-wide">DIGITAL TWIN REFLECT</span>
            </div>
            <div className="p-2.5 rounded bg-butter-yellow/40 border border-butter-yellow flex flex-col items-center justify-center col-span-2 sm:col-span-1 shadow-sm">
              <span className="text-[9.5px] text-coffee-bean font-semibold">STAGE 05</span>
              <span className="font-bold text-deep-espresso tracking-wide flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-coffee-bean" />
                TRUST OR SHUTDOWN
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SIM-TO-REAL EXPLANATION & 3-PILLAR ARCHITECTURE ================= */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20 border-b border-coffee-bean/15" id="architecture">
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-muted-coffee mb-2 font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-butter-yellow" />
            SYSTEM SPECIFICATION
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-deep-espresso tracking-tight">
            Why Edge AI Fails in the Real World — And How EdgeTwin Solves It.
          </h2>
          <p className="text-base text-muted-coffee font-editorial mt-4 leading-relaxed">
            TinyML neural nets are trained in clean simulations or idealized datasets. Once deployed to low-power microcontrollers on physical vibrating machines, mechanical wear, thermal drift, and friction drive real-world telemetry far outside what the model ever saw. EdgeTwin bridges that reality gap.
          </p>
        </div>

        {/* 3-Column Architecture Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Card 1: Physical Reality Sensing */}
          <div className="bg-oat-cream/40 border border-coffee-bean/20 rounded-xl p-6 flex flex-col justify-between hover:border-coffee-bean/40 transition-colors">
            <div>
              <div className="w-10 h-10 rounded bg-coffee-bean text-butter-yellow font-mono font-bold flex items-center justify-center text-sm mb-4 border border-deep-espresso">
                01
              </div>
              <h3 className="text-lg font-bold text-coffee-bean font-mono uppercase mb-2">PHYSICAL TELEMETRY</h3>
              <p className="text-xs font-mono text-muted-coffee leading-relaxed mb-4">
                Direct high-frequency sampling from IMU vibration (MPU6050), motor draw (ACS712), and atmospheric thermodynamics (DHT22) streamed into microcontroller register memory.
              </p>
            </div>
            <div className="pt-4 border-t border-coffee-bean/10 font-mono text-[11px] text-coffee-bean/80 space-y-1">
              <div>✓ Zero cloud dependency</div>
              <div>✓ Microsecond interrupt timing</div>
            </div>
          </div>

          {/* Card 2: Deterministic Sim-to-Real Twin */}
          <div className="bg-oat-cream/40 border border-coffee-bean/20 rounded-xl p-6 flex flex-col justify-between hover:border-coffee-bean/40 transition-colors">
            <div>
              <div className="w-10 h-10 rounded bg-coffee-bean text-butter-yellow font-mono font-bold flex items-center justify-center text-sm mb-4 border border-deep-espresso">
                02
              </div>
              <h3 className="text-lg font-bold text-coffee-bean font-mono uppercase mb-2">SIM-TO-REAL TWIN</h3>
              <p className="text-xs font-mono text-muted-coffee leading-relaxed mb-4">
                A compact, physics-based shadow model computed right on the edge chip. It mirrors nominal kinematics and computes expected bounds for every inference step.
              </p>
            </div>
            <div className="pt-4 border-t border-coffee-bean/10 font-mono text-[11px] text-coffee-bean/80 space-y-1">
              <div>✓ Physics-informed boundaries</div>
              <div>✓ Quantized 8-bit math core</div>
            </div>
          </div>

          {/* Card 3: The Trust Arbiter Layer */}
          <div className="bg-butter-yellow/20 border-2 border-coffee-bean rounded-xl p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-10 h-10 rounded bg-deep-espresso text-butter-yellow font-mono font-bold flex items-center justify-center text-sm mb-4">
                03
              </div>
              <h3 className="text-lg font-bold text-deep-espresso font-mono uppercase mb-2">TRUST LAYER ARBITER</h3>
              <p className="text-xs font-mono text-coffee-bean leading-relaxed mb-4">
                Before an AI inference triggers an actuator or motor control signal, EdgeTwin calculates the divergence between physical reality and training manifold. If out-of-distribution: fail-safe clamp engaged.
              </p>
            </div>
            <div className="pt-4 border-t border-coffee-bean/20 font-mono text-[11px] font-bold text-deep-espresso space-y-1">
              <div>✓ Deterministic safety fallback</div>
              <div>✓ 100% audit log on OLED/SPI</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BENCHMARK COMPARISON TABLE ================= */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16" id="comparison">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-muted-coffee font-bold">EVALUATION BENCHMARK</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-deep-espresso mt-1">Standalone TinyML vs. EdgeTwin Trusted Stack</h3>
          </div>
          <div className="text-xs font-mono text-muted-coffee bg-oat-cream px-3 py-1.5 rounded border border-coffee-bean/15">
            TARGET: ESP32 240MHz DUAL CORE / CORTEX-M4
          </div>
        </div>

        <div className="w-full bg-cream border-2 border-coffee-bean/30 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-coffee-bean/20 bg-oat-cream text-muted-coffee uppercase text-[11px]">
                  <th className="py-4 px-6 font-bold">Operational Metric</th>
                  <th className="py-4 px-6 font-semibold">Standard Edge ML (TensorFlow Lite / Micro)</th>
                  <th className="py-4 px-6 text-deep-espresso font-bold bg-butter-yellow/25 border-l border-r border-coffee-bean/20">
                    EdgeTwin Sim-to-Real Stack
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-coffee-bean/10 text-coffee-bean">
                <tr>
                  <td className="py-4 px-6 font-semibold">Unknown Out-of-Distribution Handling</td>
                  <td className="py-4 px-6 text-muted-coffee">Silently hallucinates false confidence</td>
                  <td className="py-4 px-6 font-bold bg-butter-yellow/10 text-deep-espresso border-l border-r border-coffee-bean/15">
                    Intercepts via Real-World Twin Bounds
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold">Sensor Degradation (Drift / Disconnect)</td>
                  <td className="py-4 px-6 text-muted-coffee">Undefined catastrophic actuation</td>
                  <td className="py-4 px-6 font-bold bg-butter-yellow/10 text-deep-espresso border-l border-r border-coffee-bean/15">
                    Immediate safe state fallback (&lt; 2.5ms)
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold">Verification Overhead</td>
                  <td className="py-4 px-6 text-muted-coffee">None (Blind trust)</td>
                  <td className="py-4 px-6 font-bold bg-butter-yellow/10 text-deep-espresso border-l border-r border-coffee-bean/15">
                    +4.2 microseconds per decision cycle
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold">On-Device Telemetry Visualization</td>
                  <td className="py-4 px-6 text-muted-coffee">UART text dumps only</td>
                  <td className="py-4 px-6 font-bold bg-butter-yellow/10 text-deep-espresso border-l border-r border-coffee-bean/15">
                    Direct OLED UI + Real-Time Telemetry Check
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ================= FINAL ACTIVATION CTA ================= */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16 w-full" id="demo-cta">
        <div className="relative rounded-2xl bg-coffee-bean text-cream p-8 sm:p-14 overflow-hidden border-2 border-deep-espresso shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#FFE89A_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-deep-espresso text-soft-butter font-mono text-[11px] font-bold mb-4 border border-cream/10">
              <span className="w-2 h-2 rounded-full bg-butter-yellow animate-ping" />
              READY FOR HARDWARE FLASHING
            </div>
            <h3 className="text-4xl sm:text-6xl font-black tracking-tight text-cream font-sans uppercase">
              ENTER THE TWIN.
            </h3>
            <p className="text-sm sm:text-base font-editorial text-cream/80 mt-3 max-w-lg leading-relaxed">
              Deploy the Sim-to-Real Trust Layer to your microcontroller in under 60 seconds. Flash the firmware or test live sensor drift on our remote bench.
            </p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-mono font-bold text-xs uppercase tracking-wider px-8 py-4 rounded bg-butter-yellow text-coffee-bean hover:bg-cream transition-all border border-soft-butter shadow-lg text-center"
            >
              <span>ENTER THE TWIN →</span>
            </Link>
            <Link
              to="/physical-twin"
              className="w-full sm:w-auto inline-flex items-center justify-center font-mono font-bold text-xs uppercase tracking-wider px-6 py-4 rounded bg-deep-espresso text-cream hover:bg-coffee-bean/80 transition-all border border-cream/20 text-center"
            >
              VIEW HARDWARE BENCH
            </Link>
          </div>
        </div>
      </section>

      {/* ================= EDITORIAL FOOTER ================= */}
      <footer className="w-full border-t border-coffee-bean/20 bg-cream py-10 px-5 sm:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-mono text-muted-coffee">
          <div className="flex items-center gap-3">
            <span className="font-bold text-coffee-bean font-mono text-sm">EDGETWIN</span>
            <span className="text-coffee-bean/30">•</span>
            <span>A SIM-TO-REAL TRUST LAYER FOR TINYML</span>
          </div>
          <div className="flex items-center gap-6">
            <span>PALETTE: CREAM / COFFEE / BUTTER</span>
            <span className="text-coffee-bean/30">•</span>
            <span className="text-coffee-bean font-semibold">NO BLUE / NO PURPLE PURITY</span>
          </div>
          <div className="text-[11px]">EXPERIMENTAL ENGINEERING SYSTEM © 2025</div>
        </div>
      </footer>
    </div>
  );
};
