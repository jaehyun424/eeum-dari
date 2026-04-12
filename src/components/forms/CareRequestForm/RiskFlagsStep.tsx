'use client';

import type { CareRequestFormData } from '@/lib/types/forms';
import { riskFlags } from '@/lib/constants/risk-flags';
import { Badge } from '@/components/ui/Badge';

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

  const toggleFlag = (id: string) => {
    const updated = selected.includes(id)
      ? selected.filter((f) => f !== id)
      : [...selected, id];
    onUpdate({ riskFlags: updated });
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-foreground">위험 사항</h2>
        <p className="text-sm text-muted mt-1">
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
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-950'
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
                <p className="font-medium text-foreground">{flag.label}</p>
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
    </div>
  );
}
