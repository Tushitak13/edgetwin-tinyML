export interface SensorData {
  temperature: number;      // °C
  vibration: number;        // g (RMS)
  current: number;          // Amps
  humidity: number;         // % RH
  rpm?: number;             // Motor speed RPM
}

export interface SensorThresholds {
  temp: { min: number; max: number };
  humidity: { min: number; max: number };
  vibe: { min: number; max: number };
  current: { min: number; max: number };
}

export interface SensorPreset {
  temp: number;
  humidity: number;
  vibe: number;
  current: number;
}
