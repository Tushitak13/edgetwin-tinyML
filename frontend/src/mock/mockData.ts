import type { SensorData, SensorPreset, SensorThresholds } from '../types/sensors';
import type { RealityGapData } from '../types/realityGap';
import type { SystemStatus } from '../types/status';
import type { LogEntry } from '../types/logs';

export const SENSOR_BOUNDS: SensorThresholds = {
  temp: { min: 35, max: 60 },
  humidity: { min: 40, max: 70 },
  vibe: { min: 0.20, max: 0.70 },
  current: { min: 1.0, max: 3.0 }
};

export const INITIAL_SENSOR_DATA: SensorData = {
  temperature: 28.4,
  vibration: 0.21,
  current: 0.43,
  humidity: 56.0,
  rpm: 1240
};

export const INITIAL_SYSTEM_STATUS: SystemStatus = {
  reality_gap: 0.087,
  trust: "TRUST",
  trustPercentage: 94.2,
  trustVerdict: "TRUSTED",
  clampState: "FAIL-SAFE ARMED",
  esp32Connected: true,
  lastSyncedSeconds: 2,
  inferenceLatencyUs: 4.2,
  ramFootprintKb: 18.4,
  firmwareVersion: "v2.1.4-twin"
};

export const INITIAL_REALITY_GAP: RealityGapData = {
  expected: 0.05,
  observed: 0.087,
  gap: 0.087,
  mahalanobisDistance: 0.41,
  klDivergence: 0.031,
  inBounds: true,
  distributionStatus: 'In-Sample Validation',
  statusText: 'LOW • IN BOUNDS'
};

export const SIMULATION_PRESETS: Record<string, SensorPreset> = {
  nominal: { temp: 42.0, humidity: 55, vibe: 0.42, current: 1.80 },
  'high-load': { temp: 58.0, humidity: 52, vibe: 0.65, current: 3.80 },
  'high-vibe': { temp: 47.0, humidity: 54, vibe: 1.45, current: 2.40 },
  overheat: { temp: 86.0, humidity: 48, vibe: 0.72, current: 3.10 },
  unseen: { temp: 94.0, humidity: 82, vibe: 1.72, current: 4.70 }
};

export const INITIAL_LOGS: LogEntry[] = [
  {
    id: 'log-1',
    timestamp: '16:42:08',
    source: 'ESP32',
    message: 'Sensor stream received without jitter.',
    tag: '100Hz',
    type: 'normal',
    badgeStyle: 'text-emerald-700'
  },
  {
    id: 'log-2',
    timestamp: '16:42:04',
    source: 'TinyML',
    message: 'Inference completed: Conf 94.2%.',
    tag: 'Validated',
    type: 'normal',
    badgeStyle: 'text-butter-dark'
  },
  {
    id: 'log-3',
    timestamp: '16:41:58',
    source: 'EdgeTwin Arbiter',
    message: 'Reality Gap calculated: 8.7% (nominal).',
    tag: 'Metric',
    type: 'metric',
    badgeStyle: 'text-coffee-muted'
  }
];

export const INITIAL_SIM_LOGS: LogEntry[] = [
  {
    id: 'sim-1',
    timestamp: '14:32:14',
    source: 'EdgeTwin Arbiter',
    message: 'Reality Gap 0.16 calculated within nominal bounds. AI confidence verified.',
    tag: 'NOMINAL',
    type: 'normal'
  },
  {
    id: 'sim-2',
    timestamp: '14:32:13',
    source: 'TinyML',
    message: 'Inference completed in 18ms via CMSIS-NN Quantized INT8 autoencoder.',
    tag: 'CORTEX-M4',
    type: 'normal'
  },
  {
    id: 'sim-3',
    timestamp: '14:32:08',
    source: 'Simulation Lab',
    message: 'Simulation initialized. 3D Digital Twin synchronized with Physical Rig 04.',
    tag: 'READY',
    type: 'normal'
  }
];
