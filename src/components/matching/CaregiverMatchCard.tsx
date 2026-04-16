'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, CheckCircle2, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils/format';
import type { CaregiverProfile } from '@/lib/types/database';
import type { MatchScore } from '@/lib/types/matching';

interface Props {
  caregiver: CaregiverProfile;
  score: MatchScore;
  isBest: boolean;
  onDetail: () => void;
  onRequest: () => void;
}

function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

function avatarFallback(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1E56A0&color=fff&size=300&font-size=0.42&bold=true`;
}

export function CaregiverMatchCard({
  caregiver,
  score,
  isBest,
  onDetail,
  onRequest,
}: Props) {
  const animatedScore = useCountUp(score.totalScore);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`relative rounded-xl border bg-background p-5 sm:p-6 shadow-sm transition-shadow hover:shadow-md ${
        isBest
          ? 'border-brand-300 dark:border-brand-700/60 ring-1 ring-brand-200 dark:ring-brand-900/40'
          : 'border-border'
      }`}
    >
      {/* 데스크톱 배지 — absolute */}
      {isBest && (
        <span className="hidden sm:inline-flex absolute -top-3 left-5 items-center rounded-full bg-accent-500 px-3 py-1 text-xs font-bold text-white shadow">
          BEST MATCH
        </span>
      )}
      {score.manualReviewRequired && (
        <span className="hidden sm:inline-flex absolute top-3 right-3 items-center rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200">
          수동 심사 대기
        </span>
      )}

      {/* 모바일 배지 행 (Row 1) — inline block */}
      {(isBest || score.manualReviewRequired) && (
        <div className="mb-4 flex flex-wrap items-center gap-2 sm:hidden">
          {isBest && (
            <span className="inline-flex items-center rounded-full bg-accent-500 px-3 py-1 text-xs font-bold text-white shadow">
              BEST MATCH
            </span>
          )}
          {score.manualReviewRequired && (
            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200">
              수동 심사 대기
            </span>
          )}
        </div>
      )}

      {/* Row 2 (모바일) / 좌측 (데스크톱): 프로필 사진 + 이름/정보 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
        <div className="flex items-start gap-4 sm:gap-5 sm:flex-1">
          <img
            src={caregiver.profile_image}
            alt=""
            width={96}
            height={96}
            loading="lazy"
            onError={(e) => {
              const img = e.currentTarget;
              if (!img.dataset.fallback) {
                img.dataset.fallback = '1';
                img.src = avatarFallback(caregiver.name);
              }
            }}
            className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-xl object-cover bg-warm-gray-100"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-foreground">
                {caregiver.name}
              </h3>
              <span className="text-sm text-muted">
                {caregiver.age}세 · {caregiver.gender === 'female' ? '여성' : '남성'}
              </span>
              {caregiver.is_verified && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-600">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  검증
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted">
              경력 {caregiver.experience_years}년
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {caregiver.certifications.slice(0, 3).map((cert) => (
                <Badge key={cert} variant="default">
                  {cert}
                </Badge>
              ))}
            </div>
            {caregiver.specialties.length > 0 && (
              <p className="mt-2 text-sm text-foreground">
                <span className="text-muted">전문분야: </span>
                {caregiver.specialties.join(' · ')}
              </p>
            )}
          </div>
        </div>

        {/* Row 3 (모바일) / 우측 (데스크톱): 매칭 점수 */}
        <div
          className={`flex w-full items-center justify-between gap-3 rounded-lg px-4 py-3 sm:w-auto sm:shrink-0 sm:flex-col sm:items-center sm:justify-center sm:gap-0 sm:min-w-[108px] ${
            isBest ? 'bg-brand-50 dark:bg-brand-900/30' : 'bg-warm-gray-50 dark:bg-warm-gray-900'
          }`}
        >
          <span className="text-4xl sm:text-5xl font-bold text-brand-600 tabular-nums leading-none">
            {animatedScore}
          </span>
          <span className="text-sm text-muted sm:mt-1">점 매치</span>
        </div>
      </div>

      {/* 정보 스트립 */}
      <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-border pt-4">
        <Stat
          icon={<Wallet className="h-4 w-4" />}
          label="시급"
          value={formatCurrency(caregiver.hourly_rate)}
        />
        <Stat
          icon={<Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />}
          label="평점"
          value={`${caregiver.rating.toFixed(1)} (${caregiver.total_reviews})`}
        />
        <Stat
          icon={<Clock className="h-4 w-4" />}
          label="응답"
          value={`${caregiver.response_time_minutes}분 이내`}
        />
        <Stat
          icon={<CheckCircle2 className="h-4 w-4" />}
          label="완료"
          value={`${caregiver.completed_jobs}건`}
        />
      </dl>

      {/* 매칭 사유 */}
      {score.recommendationReason.length > 0 && (
        <div className="mt-4 rounded-lg bg-brand-50 dark:bg-brand-900/20 px-4 py-3">
          <p className="text-sm font-semibold text-brand-700 dark:text-brand-300">
            왜 추천하나요?
          </p>
          <ul className="mt-2 space-y-1">
            {score.recommendationReason.map((reason) => (
              <li
                key={reason}
                className="flex items-start gap-2 text-sm text-foreground"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA */}
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          size="lg"
          className="h-[48px] w-full sm:w-auto sm:px-6"
          onClick={onDetail}
        >
          상세 프로필
        </Button>
        <Button
          variant="primary"
          size="lg"
          className="h-[48px] w-full sm:w-auto sm:px-6"
          onClick={onRequest}
        >
          이 분께 요청
        </Button>
      </div>
    </motion.article>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-muted">{icon}</span>
      <div className="min-w-0">
        <dt className="text-xs text-muted">{label}</dt>
        <dd className="text-sm font-medium text-foreground truncate">{value}</dd>
      </div>
    </div>
  );
}
