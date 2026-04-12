'use client';

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
        <p className="text-sm text-muted mt-1">필요한 케어 항목을 선택해주세요.</p>
      </div>
      {careCategories.map((category) => (
        <div key={category}>
          <h3 className="text-sm font-semibold text-muted mb-2">{category}</h3>
          <div className="grid grid-cols-2 gap-2">
            {careItems
              .filter((item) => item.category === category)
              .map((item) => (
                <label
                  key={item.id}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm transition-colors ${
                    selected.includes(item.id)
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950'
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
      ))}
    </div>
  );
}
