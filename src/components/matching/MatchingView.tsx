'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useMatching } from '@/hooks/useMatching';
import { MatchingProgress } from './MatchingProgress';
import { MatchSummaryCard } from './MatchSummaryCard';
import { ManualReviewBanner } from './ManualReviewBanner';
import { CaregiverMatchCard } from './CaregiverMatchCard';
import { CaregiverProfileModal } from './CaregiverProfileModal';
import { RequestConfirmModal } from './RequestConfirmModal';
import { EmptyState } from './EmptyState';
import type { CaregiverProfile } from '@/lib/types/database';
import type { MatchScore } from '@/lib/types/matching';

const MIN_ANIMATION_MS = 3000;

interface Props {
  careRequestId: string;
}

export function MatchingView({ careRequestId }: Props) {
  const router = useRouter();
  const { status, result, error, startMatching } = useMatching();
  const [animationDone, setAnimationDone] = useState(false);
  const [detailMatch, setDetailMatch] = useState<{
    caregiver: CaregiverProfile;
    score: MatchScore;
  } | null>(null);
  const [confirmMatch, setConfirmMatch] = useState<{
    caregiver: CaregiverProfile;
    score: MatchScore;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    startMatching(careRequestId);
    const timer = setTimeout(() => setAnimationDone(true), MIN_ANIMATION_MS);
    return () => clearTimeout(timer);
  }, [careRequestId, startMatching]);

  const ready =
    animationDone && (status === 'success' || status === 'error');

  if (!ready) {
    return <MatchingProgress />;
  }

  if (status === 'error') {
    return (
      <EmptyState
        title="매칭 중 문제가 발생했어요"
        description={error ?? '잠시 후 다시 시도해주세요.'}
        actionLabel="다시 시도"
        onAction={() => {
          setAnimationDone(false);
          startMatching(careRequestId);
          setTimeout(() => setAnimationDone(true), MIN_ANIMATION_MS);
        }}
      />
    );
  }

  if (!result || result.matches.length === 0) {
    return (
      <EmptyState
        actionLabel="조건 변경하기"
        onAction={() => router.push('/guardian/request')}
      />
    );
  }

  const handleRequest = async () => {
    if (!confirmMatch) return;
    setIsSubmitting(true);
    // 실제 구현 시 POST /api/contracts 호출
    await new Promise((r) => setTimeout(r, 400));
    router.push('/guardian/contracts');
  };

  return (
    <>
      <div className="mx-auto max-w-3xl space-y-5">
        <MatchSummaryCard result={result} />

        {result.manualReviewRequired && result.manualReviewReason && (
          <ManualReviewBanner reason={result.manualReviewReason} />
        )}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="space-y-4"
        >
          {result.matches.map((match, index) => (
            <motion.div
              key={match.caregiver.id}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <CaregiverMatchCard
                caregiver={match.caregiver}
                score={match.score}
                isBest={index === 0}
                onDetail={() => setDetailMatch(match)}
                onRequest={() => setConfirmMatch(match)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <CaregiverProfileModal
        isOpen={detailMatch !== null}
        caregiver={detailMatch?.caregiver ?? null}
        score={detailMatch?.score ?? null}
        onClose={() => setDetailMatch(null)}
        onRequest={() => {
          if (detailMatch) {
            setConfirmMatch(detailMatch);
            setDetailMatch(null);
          }
        }}
      />

      <RequestConfirmModal
        isOpen={confirmMatch !== null}
        caregiver={confirmMatch?.caregiver ?? null}
        isSubmitting={isSubmitting}
        onClose={() => !isSubmitting && setConfirmMatch(null)}
        onConfirm={handleRequest}
      />
    </>
  );
}
