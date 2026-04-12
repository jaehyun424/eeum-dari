'use client';

import type { CareRequestFormData } from '@/lib/types/forms';
import { Input } from '@/components/ui/Input';

interface StepProps {
  formData: Partial<CareRequestFormData>;
  onUpdate: (data: Partial<CareRequestFormData>) => void;
}

const relationOptions = [
  { value: 'spouse', label: '배우자' },
  { value: 'child', label: '자녀' },
  { value: 'sibling', label: '형제자매' },
  { value: 'other', label: '기타' },
] as const;

export function PreferencesStep({ formData, onUpdate }: StepProps) {
  const endDateUndecided = formData.endDateUndecided ?? false;

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-foreground">선호사항</h2>
      <p className="text-base text-muted">
        간병 일정과 선호사항을 입력해주세요.
      </p>

      <div className="space-y-4">
        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="careStartDate"
            label="시작일"
            type="date"
            value={formData.careStartDate ?? ''}
            onChange={(e) => onUpdate({ careStartDate: e.target.value })}
            className="py-3 text-base"
          />
          <div>
            <Input
              id="careEndDate"
              label="종료일"
              type="date"
              value={endDateUndecided ? '' : (formData.careEndDate ?? '')}
              onChange={(e) => onUpdate({ careEndDate: e.target.value })}
              disabled={endDateUndecided}
              className="py-3 text-base"
            />
            <label className="mt-2 flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={endDateUndecided}
                onChange={(e) =>
                  onUpdate({
                    endDateUndecided: e.target.checked,
                    careEndDate: e.target.checked ? '' : formData.careEndDate,
                  })
                }
                className="h-4 w-4 rounded border-border accent-brand-600"
              />
              <span className="text-sm text-muted">종료일 미정</span>
            </label>
          </div>
        </div>

        {/* Gender preference */}
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
                className={`flex-1 rounded-lg border px-4 py-3 text-base font-medium transition-colors ${
                  formData.preferredGender === gender
                    ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-400'
                    : 'border-border text-foreground hover:bg-surface-hover'
                }`}
              >
                {gender === 'any'
                  ? '무관'
                  : gender === 'male'
                    ? '남성'
                    : '여성'}
              </button>
            ))}
          </div>
        </div>

        {/* Night care toggle */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            야간케어 필요 여부
          </label>
          <div className="flex gap-3">
            {[
              { value: true, label: '필요' },
              { value: false, label: '불필요' },
            ].map((opt) => (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => onUpdate({ nightCareNeeded: opt.value })}
                className={`flex-1 rounded-lg border px-4 py-3 text-base font-medium transition-colors ${
                  formData.nightCareNeeded === opt.value
                    ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-400'
                    : 'border-border text-foreground hover:bg-surface-hover'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Guardian info */}
        <div className="space-y-3 rounded-xl border border-border bg-surface p-5">
          <p className="text-sm font-semibold text-foreground">보호자 정보</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              id="guardianName"
              label="이름"
              value={formData.guardianName ?? ''}
              onChange={(e) => onUpdate({ guardianName: e.target.value })}
              placeholder="보호자 이름"
              className="py-3 text-base"
            />
            <Input
              id="guardianPhone"
              label="연락처"
              type="tel"
              value={formData.guardianPhone ?? ''}
              onChange={(e) => onUpdate({ guardianPhone: e.target.value })}
              placeholder="010-0000-0000"
              className="py-3 text-base"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">
              관계
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {relationOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onUpdate({ guardianRelation: opt.value })}
                  className={`rounded-lg border px-3 py-3 text-base font-medium transition-colors ${
                    formData.guardianRelation === opt.value
                      ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-400'
                      : 'border-border text-foreground hover:bg-surface-hover'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Additional notes */}
        <div className="space-y-1.5">
          <label
            htmlFor="additionalNotes"
            className="block text-sm font-medium text-foreground"
          >
            추가 요청사항
          </label>
          <textarea
            id="additionalNotes"
            rows={3}
            value={formData.additionalNotes ?? ''}
            onChange={(e) => onUpdate({ additionalNotes: e.target.value })}
            placeholder="기타 요청사항이 있으면 작성해주세요"
            className="block w-full rounded-lg border border-border bg-background px-3.5 py-3 text-base text-foreground placeholder:text-muted transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
      </div>
    </div>
  );
}
