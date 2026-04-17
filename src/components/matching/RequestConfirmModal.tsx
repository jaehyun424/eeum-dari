'use client';

import { FileText, Lock, Shield, Info } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import type { CaregiverProfile } from '@/lib/types/database';

interface Props {
  isOpen: boolean;
  caregiver: CaregiverProfile | null;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function RequestConfirmModal({
  isOpen,
  caregiver,
  isSubmitting,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" title="요청 확인">
      <p className="text-base text-foreground">
        <span className="font-semibold">{caregiver?.name ?? '이 간병인'}</span> 간병사에게
        요청을 보내시겠습니까?
      </p>

      <ul className="mt-5 space-y-3">
        <Row
          icon={<FileText className="h-5 w-5 text-brand-600" />}
          title="표준계약서 템플릿이 함께 안내됩니다"
          description="요청이 수락되면 양측이 확인·서명하는 표준 간병 계약 템플릿이 제공됩니다. (전자서명 연동 준비 중)"
        />
        <Row
          icon={<Lock className="h-5 w-5 text-brand-600" />}
          title="에스크로 기반 안심결제를 준비 중입니다"
          description="베타 기간 동안 실제 금전 거래는 발생하지 않으며, 정식 출시와 함께 에스크로 결제가 도입됩니다."
        />
        <Row
          icon={<Shield className="h-5 w-5 text-brand-600" />}
          title="배상책임보험 연동을 준비 중입니다"
          description="정식 출시 시 간병 중 사고에 대비한 배상책임보험이 기본 포함될 예정입니다."
        />
      </ul>

      <div className="mt-4 flex items-start gap-2 rounded-lg bg-warm-gray-50 dark:bg-warm-gray-900 p-3 text-xs text-muted">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <p>
          베타 단계이므로 요청은 운영팀이 수동 확인 후 간병인에게 전달합니다.
          정식 계약은 양측 확인 이후 체결됩니다.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          size="lg"
          className="h-[48px] sm:px-6"
          onClick={onClose}
          disabled={isSubmitting}
        >
          취소
        </Button>
        <Button
          variant="primary"
          size="lg"
          className="h-[48px] sm:px-6"
          onClick={onConfirm}
          isLoading={isSubmitting}
        >
          요청 보내기
        </Button>
      </div>
    </Modal>
  );
}

function Row({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5">{icon}</span>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-sm text-muted leading-relaxed">{description}</p>
      </div>
    </li>
  );
}
