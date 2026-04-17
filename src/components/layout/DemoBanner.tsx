'use client';

import { X } from 'lucide-react';
import { useSyncExternalStore, useState } from 'react';

const STORAGE_KEY = 'eeum:demoBanner:dismissed';

// localStorage는 외부 저장소이므로 useSyncExternalStore로 안전하게 읽는다.
// set-state-in-effect 경고 없이 SSR/CSR 일관성을 유지한다.
function subscribeStorage(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function readDismissed(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function DemoBanner() {
  const dismissedFromStorage = useSyncExternalStore(
    subscribeStorage,
    readDismissed,
    () => false, // SSR 기본값: dismissed=false → 배너 렌더 (하지만 hidden 처리)
  );
  // 같은 탭에서 닫기를 누르면 storage 이벤트가 발생하지 않으므로
  // 로컬 상태로도 한 번 더 관리한다.
  const [localDismissed, setLocalDismissed] = useState(false);

  const dismissed = dismissedFromStorage || localDismissed;

  function dismiss() {
    setLocalDismissed(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // storage 실패는 silent — 이번 세션만 숨김
    }
  }

  if (dismissed) return null;

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
