import type { RealityGapData } from '../types/realityGap';
import { INITIAL_REALITY_GAP } from '../mock/mockData';
import { apiClient, USE_MOCK } from './client';

export async function getRealityGap(): Promise<RealityGapData> {
  if (USE_MOCK) {
    return Promise.resolve({ ...INITIAL_REALITY_GAP });
  }
  return apiClient<RealityGapData>('/api/reality-gap');
}
