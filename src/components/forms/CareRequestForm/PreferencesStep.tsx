'use client';

import type { CareRequestFormData } from '@/lib/types/forms';
import { Input } from '@/components/ui/Input';

interface StepProps {
  formData: Partial<CareRequestFormData>;
  onUpdate: (data: Partial<CareRequestFormData>) => void;
}

export function PreferencesStep({ formData, onUpdate }: StepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">선호사항</h2>
      <p className="text-sm text-muted">간병 일정과 선호사항을 입력해주세요.</p>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="careStartDate"
            label="시작일"
            type="date"
            value={formData.careStartDate ?? ''}
            onChange={(e) => onUpdate({ careStartDate: e.target.value })}
          />
          <Input
            id="careEndDate"
            label="종료일"
            type="date"
            value={formData.careEndDate ?? ''}
            onChange={(e) => onUpdate({ careEndDate: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            간병인 성별 선호
          </label>
          <div className="flex gap-2">
            {(['any', 'male', 'female'] as const).map((gender) => (
              <button
                key={gender}
                type="button"
                onClick={() => onUpdate({ preferredGender: gender })}
                className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                  formData.preferredGender === gender
                    ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-400'
                    : 'border-border text-foreground hover:bg-surface-hover'
                }`}
              >
                {gender === 'any' ? '무관' : gender === 'male' ? '남성' : '여성'}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="additionalNotes"
            className="block text-sm font-medium text-foreground"
          >
            추가 요청사항
          </label>
          <textarea
            id="additionalNotes"
            rows={4}
            value={formData.additionalNotes ?? ''}
            onChange={(e) => onUpdate({ additionalNotes: e.target.value })}
            placeholder="기타 요청사항이 있으면 작성해주세요"
            className="block w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
      </div>
    </div>
  );
}
