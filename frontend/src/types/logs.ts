export interface LogEntry {
  id: string;
  timestamp: string;
  source: 'ESP32' | 'TinyML' | 'EdgeTwin Arbiter' | 'Simulation Lab' | 'EdgeTwin';
  message: string;
  tag?: string;
  type?: 'normal' | 'alert' | 'metric';
  badgeStyle?: string;
}
