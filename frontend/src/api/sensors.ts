import type { SensorData } from '../types/sensors';
import { INITIAL_SENSOR_DATA } from '../mock/mockData';
import { apiClient, USE_MOCK } from './client';

export async function getSensors(): Promise<SensorData> {
  if (USE_MOCK) {
    return Promise.resolve({ ...INITIAL_SENSOR_DATA });
  }
  return apiClient<SensorData>('/api/sensors');
}
