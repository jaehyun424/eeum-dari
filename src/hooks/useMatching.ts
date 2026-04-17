'use client';

import { useCallback, useState } from 'react';
import type { MatchResult, MatchingStatus } from '@/lib/types/matching';
import type { CareRequestFormData } from '@/lib/types/forms';

interface UseMatchingState {
  status: MatchingStatus;
  result: (MatchResult & { careRequestId?: string }) | null;
  error: string | null;
  notFound: boolean;
}

const initialState: UseMatchingState = {
  status: 'idle',
  result: null,
  error: null,
  notFound: false,
};

export type MatchingRequestBody =
  | { careRequestId: string; formData?: Partial<CareRequestFormData> }
  | { formData: Partial<CareRequestFormData> };

export function useMatching() {
  const [state, setState] = useState<UseMatchingState>(initialState);

  const requestMatch = useCallback(async (body: MatchingRequestBody) => {
    setState({
      status: 'loading',
      result: null,
      error: null,
      notFound: false,
    });

    try {
      const response = await fetch('/api/matching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const notFound = response.status === 404;
        setState({
          status: 'error',
          result: null,
          error: data?.error ?? '매칭에 실패했습니다.',
          notFound,
        });
        return;
      }

      setState({
        status: 'success',
        result: data as MatchResult & { careRequestId?: string },
        error: null,
        notFound: false,
      });
    } catch (err) {
      setState({
        status: 'error',
        result: null,
        error:
          err instanceof Error
            ? err.message
            : '매칭 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        notFound: false,
      });
    }
  }, []);

  // 하위 호환: 기존 호출부(careRequestId만)를 지원
  const startMatching = useCallback(
    (careRequestId: string, formData?: Partial<CareRequestFormData>) =>
      requestMatch({ careRequestId, formData }),
    [requestMatch],
  );

  return {
    status: state.status,
    result: state.result,
    error: state.error,
    notFound: state.notFound,
    startMatching,
    requestMatch,
  };
}
