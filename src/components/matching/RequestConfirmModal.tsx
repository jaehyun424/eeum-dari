'use client';

import { FileText, Lock, Shield } from 'lucide-react';
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
          title="표준계약서가 자동 생성됩니다"
          description="요청 수락 시 양측이 확인·서명하는 표준 간병 계약서가 만들어집니다."
        />
        <Row
          icon={<Lock className="h-5 w-5 text-brand-600" />}
          title="에스크로 결제로 완료 후 정산됩니다"
          description="결제 금액은 제3자 예치되어 간병 완료 후 간병인께 정산됩니다."
        />
        <Row
          icon={<Shield className="h-5 w-5 text-brand-600" />}
          title="배상책임보험이 자동 적용됩니다"
          description="이음다리를 통한 모든 간병 계약에 배상책임보험이 기본 포함됩니다."
        />
      </ul>

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
