'use client';

import { useState } from 'react';
import type { MatchResult } from '@/lib/types/matching';

export function useMatching() {
  const [result, setResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startMatching = async (careRequestId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/matching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ careRequestId }),
      });

      if (!response.ok) throw new Error('매칭 요청에 실패했습니다');

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, startMatching };
}
