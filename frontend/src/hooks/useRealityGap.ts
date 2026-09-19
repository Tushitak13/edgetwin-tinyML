import { useState, useEffect } from 'react';
import type { RealityGapData } from '../types/realityGap';
import { getRealityGap } from '../api/realityGap';
import { INITIAL_REALITY_GAP } from '../mock/mockData';

export function useRealityGap() {
  const [realityGap, setRealityGap] = useState<RealityGapData>(INITIAL_REALITY_GAP);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getRealityGap()
      .then((data) => {
        setRealityGap(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { realityGap, setRealityGap, loading, error };
}
