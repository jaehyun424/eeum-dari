'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import type { CareRequestFormData } from '@/lib/types/forms';
import { riskFlags } from '@/lib/constants/risk-flags';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface StepProps {
  formData: Partial<CareRequestFormData>;
  onUpdate: (data: Partial<CareRequestFormData>) => void;
}

const severityVariant = {
  low: 'default',
  medium: 'warning',
  high: 'danger',
} as const;

export function RiskFlagsStep({ formData, onUpdate }: StepProps) {
  const selected = formData.riskFlags ?? [];
  const [dangerModalOpen, setDangerModalOpen] = useState(false);
  const [pendingFlagId, setPendingFlagId] = useState<string | null>(null);

  const toggleFlag = (id: string) => {
    const flag = riskFlags.find((f) => f.id === id);

    // If selecting a danger flag, show confirmation modal
    if (flag?.danger && !selected.includes(id)) {
      setPendingFlagId(id);
      setDangerModalOpen(true);
      return;
    }

    const updated = selected.includes(id)
      ? selected.filter((f) => f !== id)
      : [...selected, id];
    onUpdate({ riskFlags: updated });
  };

  const confirmDanger = () => {
    if (pendingFlagId) {
      onUpdate({ riskFlags: [...selected, pendingFlagId] });
      setPendingFlagId(null);
    }
    setDangerModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-foreground">위험 사항</h2>
        <p className="text-base text-muted mt-1">
          해당되는 위험 사항을 선택해주세요. 정확한 정보가 안전한 간병에
          도움이 됩니다.
        </p>
      </div>
      <div className="space-y-2">
        {riskFlags.map((flag) => (
          <label
            key={flag.id}
            className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors ${
              selected.includes(flag.id)
                ? flag.danger
                  ? 'border-danger bg-danger/5'
                  : 'border-brand-500 bg-brand-50 dark:bg-brand-950'
                : 'border-border hover:bg-surface-hover'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selected.includes(flag.id)}
                onChange={() => toggleFlag(flag.id)}
                className="sr-only"
              />
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-base font-medium text-foreground">
                    {flag.label}
                  </p>
                  {flag.danger && (
                    <AlertTriangle className="h-4 w-4 text-danger" />
                  )}
                </div>
                <p className="text-sm text-muted">{flag.description}</p>
              </div>
            </div>
            <Badge variant={severityVariant[flag.severity]}>
              {flag.severity === 'high'
                ? '높음'
                : flag.severity === 'medium'
                  ? '보통'
                  : '낮음'}
            </Badge>
          </label>
        ))}
      </div>

      {/* Danger confirmation modal */}
      <Modal
        isOpen={dangerModalOpen}
        onClose={() => {
          setDangerModalOpen(false);
          setPendingFlagId(null);
        }}
        title="의료행위 경계 알림"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg bg-danger/5 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
            <p className="text-base text-foreground">
              이 항목은 의료행위와 경계가 불분명한 영역입니다. 자동 매칭이
              제한되며, 전문 간병인 수동 심사를 통해 배정됩니다.
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                setDangerModalOpen(false);
                setPendingFlagId(null);
              }}
            >
              취소
            </Button>
            <Button variant="danger" size="lg" onClick={confirmDanger}>
              확인
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
