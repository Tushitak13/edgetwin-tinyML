import type { SystemStatus } from '../types/status';
import { INITIAL_SYSTEM_STATUS } from '../mock/mockData';
import { apiClient, USE_MOCK } from './client';

export async function getSystemStatus(): Promise<SystemStatus> {
  if (USE_MOCK) {
    return Promise.resolve({ ...INITIAL_SYSTEM_STATUS });
  }
  return apiClient<SystemStatus>('/api/status');
}
