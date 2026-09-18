import { useState, useEffect } from 'react';
import type { SensorData } from '../types/sensors';
import { getSensors } from '../api/sensors';
import { INITIAL_SENSOR_DATA } from '../mock/mockData';

export function useSensors(autoJitter = false) {
  const [sensors, setSensors] = useState<SensorData>(INITIAL_SENSOR_DATA);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getSensors()
      .then((data) => {
        setSensors(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  // Ambient slight fluctuation for natural live stream feel
  useEffect(() => {
    if (!autoJitter) return;
    const interval = setInterval(() => {
      setSensors((prev) => ({
        ...prev,
        temperature: +(prev.temperature + (Math.random() * 0.2 - 0.1)).toFixed(1),
        vibration: +(Math.max(0.1, prev.vibration + (Math.random() * 0.02 - 0.01))).toFixed(2),
        current: +(Math.max(0.2, prev.current + (Math.random() * 0.02 - 0.01))).toFixed(2),
      }));
    }, 2400);

    return () => clearInterval(interval);
  }, [autoJitter]);

  return { sensors, setSensors, loading, error };
}
