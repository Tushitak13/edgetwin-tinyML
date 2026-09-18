import type { LogEntry } from '../types/logs';
import { INITIAL_LOGS } from '../mock/mockData';
import { apiClient, USE_MOCK } from './client';

export async function getLogs(): Promise<LogEntry[]> {
  if (USE_MOCK) {
    return Promise.resolve([...INITIAL_LOGS]);
  }
  return apiClient<LogEntry[]>('/api/logs');
}
