'use client';

import { AlertTriangle } from 'lucide-react';
import type { CareRequestFormData } from '@/lib/types/forms';
import { careItems, careCategories } from '@/lib/constants/care-items';

interface StepProps {
  formData: Partial<CareRequestFormData>;
  onUpdate: (data: Partial<CareRequestFormData>) => void;
}

export function CareItemsStep({ formData, onUpdate }: StepProps) {
  const selected = formData.careItems ?? [];

  const toggleItem = (id: string) => {
    const updated = selected.includes(id)
      ? selected.filter((item) => item !== id)
      : [...selected, id];
    onUpdate({ careItems: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">케어 항목</h2>
        <p className="text-base text-muted mt-1">
          필요한 케어 항목을 선택해주세요.
        </p>
      </div>
      {careCategories.map((category) => {
        const isMedical = category === '의료 보조';
        return (
          <div key={category}>
            <h3 className="text-sm font-semibold text-muted mb-2">
              {isMedical ? '의료 보조 (\u26A0 주의)' : category}
            </h3>
            {isMedical && (
              <div className="mb-3 flex items-start gap-2 rounded-lg border border-warning/50 bg-warning/10 p-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                <p className="text-sm text-foreground">
                  아래 항목은 의료행위와 경계가 불분명한 영역입니다. 선택 시
                  전문 간병인이 배정됩니다.
                </p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              {careItems
                .filter((item) => item.category === category)
                .map((item) => (
                  <label
                    key={item.id}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3.5 text-base transition-colors ${
                      selected.includes(item.id)
                        ? isMedical
                          ? 'border-warning bg-warning/10'
                          : 'border-brand-500 bg-brand-50 dark:bg-brand-950'
                        : 'border-border hover:bg-surface-hover'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(item.id)}
                      onChange={() => toggleItem(item.id)}
                      className="sr-only"
                    />
                    <span className="text-foreground">{item.label}</span>
                  </label>
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
