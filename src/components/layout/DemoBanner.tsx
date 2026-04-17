'use client';

import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'eeum:demoBanner:dismissed';

export function DemoBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // hydration mismatch 방지 — 초기 SSR은 null, 마운트 후 storage 읽고 결정
    try {
      const dismissed = window.localStorage.getItem(STORAGE_KEY) === '1';
      setVisible(!dismissed);
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // storage 실패는 silent — 이번 세션만 숨김
    }
  }

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="relative border-b border-brand-200 bg-brand-50 text-brand-900 dark:border-brand-900/40 dark:bg-brand-900/20 dark:text-brand-100"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 text-xs sm:px-6 sm:text-sm lg:px-8">
        <p className="leading-relaxed">
          <span aria-hidden>🎨 </span>
          베타 서비스 —{' '}
          <span className="text-brand-700 dark:text-brand-200">
            표시되는 사용자·간병인 정보는 예시 데이터이며, 결제·계약은 실제로 체결되지 않습니다.
          </span>
        </p>
        <button
          type="button"
          aria-label="배너 닫기"
          onClick={dismiss}
          className="shrink-0 rounded p-1 text-brand-700 hover:bg-brand-100 dark:text-brand-200 dark:hover:bg-brand-900/40"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
