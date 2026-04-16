'use client';

import { useCallback, useState } from 'react';
import type { MatchResult, MatchingStatus } from '@/lib/types/matching';

interface UseMatchingState {
  status: MatchingStatus;
  result: MatchResult | null;
  error: string | null;
}

const initialState: UseMatchingState = {
  status: 'idle',
  result: null,
  error: null,
};

export function useMatching() {
  const [state, setState] = useState<UseMatchingState>(initialState);

  const startMatching = useCallback(async (careRequestId: string) => {
    setState({ status: 'loading', result: null, error: null });

    try {
      const response = await fetch('/api/matching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ careRequestId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? '매칭에 실패했습니다.');
      }

      setState({ status: 'success', result: data as MatchResult, error: null });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : '매칭 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      setState({ status: 'error', result: null, error: message });
    }
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    status: state.status,
    result: state.result,
    error: state.error,
    startMatching,
    reset,
  };
}
