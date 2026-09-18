export type TrustState = 'TRUSTED' | 'CAUTION' | 'REDUCED TRUST' | 'UNTRUSTED • CLAMPED';

export type ClampState = 'FAIL-SAFE ARMED' | 'CLAMP ACTIVATED (<1.2ms)' | 'WATCH' | 'TRIPPED';

export interface SystemStatus {
  reality_gap: number;
  trust: "TRUST" | "CAUTION" | "REJECT" | "UNKNOWN";
  trustPercentage: number;
  trustVerdict: TrustState;
  clampState: ClampState;
  esp32Connected: boolean;
  lastSyncedSeconds: number;
  inferenceLatencyUs: number;
  ramFootprintKb: number;
  firmwareVersion: string;
}

export interface PredictionResult {
  label: 'NORMAL' | 'FAULT' | 'DRIFT_SUSPECTED' | 'ANOMALY_CONFIRMED';
  confidence: number;
}
