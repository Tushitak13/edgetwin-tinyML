import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <aside className="w-56 shrink-0 hidden md:flex flex-col justify-between">
      <div className="space-y-6">
        {/* Navigation Menu */}
        <nav className="space-y-1.5 font-mono text-sm">
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-semibold transition-all ${
              path === '/dashboard'
                ? 'bg-coffee text-butter shadow-md'
                : 'text-coffee-muted hover:text-coffee hover:bg-white/60 font-medium'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>Overview</span>
            {path === '/dashboard' && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-butter" />
            )}
          </Link>

          <Link
            to="/physical-twin"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-semibold transition-all ${
              path === '/physical-twin'
                ? 'bg-coffee text-butter shadow-md'
                : 'text-coffee-muted hover:text-coffee hover:bg-white/60 font-medium'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>Physical Twin</span>
            {path === '/physical-twin' && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-butter" />
            )}
          </Link>

          <a
            href="#ai-model"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-coffee-muted hover:text-coffee hover:bg-white/60 font-medium transition-all"
          >
            <svg className="w-4 h-4 text-coffee/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M13 10V3L4 14h7v7l9-11h-7z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>AI Model</span>
          </a>

          <a
            href="#reality-monitor"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-coffee-muted hover:text-coffee hover:bg-white/60 font-medium transition-all"
          >
            <svg className="w-4 h-4 text-coffee/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>Reality Monitor</span>
          </a>

          <a
            href="#live-logs"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-coffee-muted hover:text-coffee hover:bg-white/60 font-medium transition-all"
          >
            <svg className="w-4 h-4 text-coffee/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>Live Logs</span>
          </a>

          <Link
            to="/"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-coffee-muted hover:text-coffee hover:bg-white/60 font-medium transition-all"
          >
            <svg className="w-4 h-4 text-coffee/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>Landing Page</span>
          </Link>
        </nav>

        {/* Lab Bench Specs Card */}
        <div className="p-4 rounded-2xl bg-white/70 border border-coffee/10 shadow-sm space-y-2.5 font-mono">
          <div className="text-[10px] uppercase tracking-widest text-coffee-muted font-bold">
            Lab Bench Target
          </div>
          <div className="text-xs font-semibold text-coffee">Dual-Core ESP32 240MHz</div>
          <div className="flex items-center justify-between text-[11px] text-coffee-muted pt-1 border-t border-coffee/10">
            <span>RAM Footprint</span>
            <span className="font-bold text-coffee">18.4 KB</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-coffee-muted">
            <span>Inference Latency</span>
            <span className="font-bold text-coffee">4.2 µs</span>
          </div>
          <div className="bg-coffee-deep/5 rounded-xl p-2 border border-coffee/10 mt-1 flex items-center justify-between">
            <span className="text-[10px] text-coffee/70">Deterministic Clamp</span>
            <span className="text-[10px] font-bold text-emerald-800">ARMED</span>
          </div>
        </div>
      </div>

      {/* Footer Quick Status */}
      <div className="p-3.5 rounded-2xl bg-cream-50 border border-coffee/10 text-xs font-mono text-coffee-muted shadow-sm">
        <div className="flex items-center justify-between text-coffee font-semibold mb-1">
          <span>Firmware</span>
          <span className="text-emerald-700">v2.1.4-twin</span>
        </div>
        <div>Determinism: 100% Clamped</div>
      </div>
    </aside>
  );
};
