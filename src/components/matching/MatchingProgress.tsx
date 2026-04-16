'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

const STEPS = [
  '병원 위치 분석',
  '경력·자격 검증',
  '위험 요인 매칭',
  '최적 매칭 완료',
] as const;

const DURATION_MS = 3000;

export function MatchingProgress() {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION_MS);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const stepDelay = DURATION_MS / STEPS.length;
    const timers = STEPS.map((_, i) =>
      setTimeout(() => setStage(i + 1), stepDelay * (i + 1)),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);
  const percent = Math.round(progress * 100);

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <h2 className="text-xl sm:text-2xl font-bold text-foreground text-center">
        조건에 맞는 간병인을 찾고 있습니다
      </h2>
      <p className="mt-2 text-base text-muted text-center">
        12명의 후보를 정밀하게 매칭하고 있어요
      </p>

      <div className="relative mt-10 h-48 w-48">
        <svg
          viewBox="0 0 160 160"
          className="h-full w-full -rotate-90"
          aria-hidden
        >
          <circle
            cx="80"
            cy="80"
            r={radius}
            strokeWidth="10"
            className="fill-none stroke-warm-gray-200 dark:stroke-warm-gray-800"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            strokeWidth="10"
            strokeLinecap="round"
            className="fill-none stroke-brand-600 transition-[stroke-dashoffset] duration-75 ease-linear"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold text-brand-600 tabular-nums">
            {percent}%
          </span>
        </div>
      </div>

      <ul className="mt-12 w-full max-w-sm space-y-3">
        <AnimatePresence initial={false}>
          {STEPS.map((label, i) => {
            const visible = i < stage;
            if (!visible) {
              return (
                <li
                  key={label}
                  className="flex items-center gap-3 text-base text-muted opacity-40"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border" />
                  <span>{label}</span>
                </li>
              );
            }
            return (
              <motion.li
                key={label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3 text-base font-medium text-foreground"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-white">
                  <Check className="h-4 w-4" strokeWidth={3} />
                </span>
                <span>{label}</span>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}
