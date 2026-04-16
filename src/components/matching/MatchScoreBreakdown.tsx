'use client';

import { motion } from 'framer-motion';
import type { MatchBreakdown } from '@/lib/types/matching';

interface Props {
  breakdown: MatchBreakdown;
}

const LABELS: Array<{ key: keyof MatchBreakdown; label: string }> = [
  { key: 'skillMatch', label: '케어 항목 일치' },
  { key: 'experience', label: '경력' },
  { key: 'rating', label: '평점·후기' },
  { key: 'distance', label: '지역 근접성' },
  { key: 'availability', label: '응답 속도' },
  { key: 'riskHandling', label: '위험 대응력' },
];

export function MatchScoreBreakdown({ breakdown }: Props) {
  return (
    <ul className="space-y-3">
      {LABELS.map(({ key, label }) => {
        const value = breakdown[key];
        return (
          <li key={key} className="grid grid-cols-[120px_1fr_40px] items-center gap-3">
            <span className="text-sm text-muted">{label}</span>
            <div className="h-2.5 rounded-full bg-warm-gray-100 dark:bg-warm-gray-800 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  value >= 80
                    ? 'bg-brand-600'
                    : value >= 60
                      ? 'bg-brand-500'
                      : 'bg-warm-gray-400'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
            <span className="text-sm font-semibold text-foreground text-right tabular-nums">
              {value}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
