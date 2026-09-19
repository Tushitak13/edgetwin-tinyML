export interface RealityGapData {
  expected: number;
  observed: number;
  gap: number;                     // 0.0 - 1.0 or percentage
  mahalanobisDistance?: number;
  klDivergence?: number;
  inBounds: boolean;
  distributionStatus: 'In-Sample Validation' | 'Out-of-Distribution Drift' | 'Borderline Envelope';
  statusText: 'LOW • IN BOUNDS' | 'MODERATE • BORDERLINE' | 'OUTSIDE VALIDATED DOMAIN' | 'CLAMP TRIP • UNSEEN DOMAIN';
}

export interface EnvelopeSummary {
  calibrated: boolean;
  percentile: number;
  threshold: number;
  featureMeans: Record<string, number>;
}
