'use client';

import type { CareRequestFormData } from '@/lib/types/forms';
import { Input } from '@/components/ui/Input';

interface StepProps {
  formData: Partial<CareRequestFormData>;
  onUpdate: (data: Partial<CareRequestFormData>) => void;
}

const mobilityOptions = [
  { value: 'independent', label: '독립보행' },
  { value: 'assisted', label: '부축필요' },
  { value: 'wheelchair', label: '휠체어' },
  { value: 'bedridden', label: '와상' },
] as const;

const positionChangeOptions = [
  { value: 'none', label: '필요없음' },
  { value: '2h', label: '2시간' },
  { value: '4h', label: '4시간' },
  { value: 'medical', label: '의료진지시' },
] as const;

export function PatientStep({ formData, onUpdate }: StepProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-foreground">환자 정보</h2>
      <p className="text-base text-muted">환자의 기본 정보를 입력해주세요.</p>

      <div className="space-y-4">
        <Input
          id="patientName"
          label="환자 이름"
          value={formData.patientName ?? ''}
          onChange={(e) => onUpdate({ patientName: e.target.value })}
          placeholder="홍길동"
          className="py-3 text-base"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="patientAge"
            label="나이"
            type="number"
            value={formData.patientAge ?? ''}
            onChange={(e) => onUpdate({ patientAge: Number(e.target.value) })}
            placeholder="65"
            className="py-3 text-base"
          />
          <Input
            id="patientWeight"
            label="체중 (kg)"
            type="number"
            value={formData.patientWeight ?? ''}
            onChange={(e) =>
              onUpdate({ patientWeight: Number(e.target.value) || undefined })
            }
            placeholder="체중 (kg)"
            className="py-3 text-base"
          />
        </div>

        {/* Gender */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            성별
          </label>
          <div className="flex gap-3">
            {(['male', 'female'] as const).map((gender) => (
              <button
                key={gender}
                type="button"
                onClick={() => onUpdate({ patientGender: gender })}
                className={`flex-1 rounded-lg border px-4 py-3 text-base font-medium transition-colors ${
                  formData.patientGender === gender
                    ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-400'
                    : 'border-border text-foreground hover:bg-surface-hover'
                }`}
              >
                {gender === 'male' ? '남성' : '여성'}
              </button>
            ))}
          </div>
        </div>

        {/* Mobility level */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            거동 수준
          </label>
          <div className="grid grid-cols-2 gap-2">
            {mobilityOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onUpdate({ mobilityLevel: opt.value })}
                className={`rounded-lg border px-4 py-3 text-base font-medium transition-colors ${
                  formData.mobilityLevel === opt.value
                    ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-400'
                    : 'border-border text-foreground hover:bg-surface-hover'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Position change frequency */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            체위변경 빈도
          </label>
          <div className="grid grid-cols-2 gap-2">
            {positionChangeOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onUpdate({ positionChangeFreq: opt.value })}
                className={`rounded-lg border px-4 py-3 text-base font-medium transition-colors ${
                  formData.positionChangeFreq === opt.value
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
    </div>
  );
}
