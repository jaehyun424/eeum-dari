'use client';

import { Star, CheckCircle2, Award } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MatchScoreBreakdown } from './MatchScoreBreakdown';
import { getReviewsForCaregiver } from '@/lib/mock/reviews';
import { formatDate, formatCurrency } from '@/lib/utils/format';
import type { CaregiverProfile } from '@/lib/types/database';
import type { MatchScore } from '@/lib/types/matching';

interface Props {
  isOpen: boolean;
  caregiver: CaregiverProfile | null;
  score: MatchScore | null;
  onClose: () => void;
  onRequest: () => void;
}

export function CaregiverProfileModal({
  isOpen,
  caregiver,
  score,
  onClose,
  onRequest,
}: Props) {
  if (!caregiver || !score) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="lg" title="간병인 상세">
        <div />
      </Modal>
    );
  }

  const reviews = getReviewsForCaregiver(caregiver.id, 3);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      {/* 프로필 헤더 */}
      <section className="flex items-start gap-4">
        <img
          src={caregiver.profile_image}
          alt=""
          width={88}
          height={88}
          className="h-20 w-20 shrink-0 rounded-xl object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-foreground">
              {caregiver.name}
            </h2>
            <span className="text-sm text-muted">
              {caregiver.age}세 · {caregiver.gender === 'female' ? '여성' : '남성'}
            </span>
            {caregiver.is_verified && (
              <Badge variant="brand">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                검증 완료
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-muted">
            경력 {caregiver.experience_years}년 · 완료 {caregiver.completed_jobs}건
          </p>
          <div className="mt-1 flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            <span className="font-semibold text-foreground">
              {caregiver.rating.toFixed(1)}
            </span>
            <span className="text-muted">({caregiver.total_reviews})</span>
          </div>
        </div>
      </section>

      {/* 소개 */}
      <section className="mt-5">
        <h3 className="text-sm font-semibold text-foreground">소개</h3>
        <p className="mt-2 text-sm leading-relaxed text-foreground/90">
          {caregiver.bio}
        </p>
      </section>

      {/* 매칭 점수 breakdown */}
      <section className="mt-6">
        <div className="flex items-baseline justify-between">
          <h3 className="text-sm font-semibold text-foreground">매칭 점수 분석</h3>
          <span className="text-lg font-bold text-brand-600 tabular-nums">
            {score.totalScore}점
          </span>
        </div>
        <div className="mt-3">
          <MatchScoreBreakdown breakdown={score.breakdown} />
        </div>
      </section>

      {/* 자격 */}
      <section className="mt-6">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
          <Award className="h-4 w-4 text-brand-600" />
          보유 자격
        </h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {caregiver.certifications.map((cert) => (
            <Badge key={cert} variant="brand">
              {cert}
            </Badge>
          ))}
        </div>
        {caregiver.specialties.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-muted">전문분야</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {caregiver.specialties.map((sp) => (
                <Badge key={sp} variant="default">
                  {sp}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 요금 */}
      <section className="mt-6 rounded-lg bg-warm-gray-50 dark:bg-warm-gray-900 p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted">시간당</p>
            <p className="mt-1 text-lg font-bold text-foreground">
              {formatCurrency(caregiver.hourly_rate)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted">1일(24시간)</p>
            <p className="mt-1 text-lg font-bold text-foreground">
              {formatCurrency(caregiver.daily_rate)}
            </p>
          </div>
        </div>
      </section>

      {/* 후기 */}
      <section className="mt-6">
        <h3 className="text-sm font-semibold text-foreground">
          보호자 후기 {reviews.length > 0 && `(최근 ${reviews.length}건)`}
        </h3>
        {reviews.length === 0 ? (
          <p className="mt-2 text-sm text-muted">아직 등록된 후기가 없습니다.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {reviews.map((rv) => (
              <li
                key={rv.id}
                className="rounded-lg border border-border p-3.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {rv.guardian_name}
                    </span>
                    <span className="flex items-center gap-0.5 text-sm text-yellow-600">
                      {Array.from({ length: rv.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500"
                        />
                      ))}
                    </span>
                  </div>
                  <span className="text-xs text-muted">{formatDate(rv.date)}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                  {rv.comment}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* CTA */}
      <div className="mt-6 sticky bottom-0 bg-background pt-2">
        <Button
          variant="primary"
          size="lg"
          className="h-[52px] w-full"
          onClick={onRequest}
        >
          이 분께 요청하기
        </Button>
      </div>
    </Modal>
  );
}
