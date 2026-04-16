'use client';

import { AlertTriangle } from 'lucide-react';

interface Props {
  reason: string;
}

export function ManualReviewBanner({ reason }: Props) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-yellow-300 bg-yellow-50 p-4 dark:border-yellow-700/50 dark:bg-yellow-900/20">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600 dark:text-yellow-400" />
      <div className="space-y-1">
        <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
          수동 심사 대기
        </p>
        <p className="text-sm text-yellow-800 dark:text-yellow-200/90 leading-relaxed">
          {reason}
        </p>
      </div>
    </div>
  );
}
