'use client';

import { HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Props {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = '조건에 맞는 간병인이 아직 없어요',
  description = '조건을 조금만 바꾸면 더 많은 간병인을 찾을 수 있어요.',
  actionLabel = '조건 변경하기',
  onAction,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-900/30">
        <HeartHandshake className="h-8 w-8 text-brand-600" />
      </div>
      <h2 className="mt-5 text-xl font-bold text-foreground">{title}</h2>
      <p className="mt-2 text-base text-muted max-w-md">{description}</p>
      {onAction && (
        <Button
          variant="primary"
          size="lg"
          className="mt-6 h-[48px] px-8"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
