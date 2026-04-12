'use client';

import type { CareRequestFormData } from '@/lib/types/forms';
import { Input } from '@/components/ui/Input';

interface StepProps {
  formData: Partial<CareRequestFormData>;
  onUpdate: (data: Partial<CareRequestFormData>) => void;
}

export function PatientStep({ formData, onUpdate }: StepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">환자 정보</h2>
      <p className="text-sm text-muted">환자의 기본 정보를 입력해주세요.</p>
      <div className="space-y-4">
        <Input
          id="patientName"
          label="환자 이름"
          value={formData.patientName ?? ''}
          onChange={(e) => onUpdate({ patientName: e.target.value })}
          placeholder="홍길동"
        />
        <Input
          id="patientAge"
          label="나이"
          type="number"
          value={formData.patientAge ?? ''}
          onChange={(e) => onUpdate({ patientAge: Number(e.target.value) })}
          placeholder="65"
        />
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
                className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
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
      </div>
    </div>
  );
}
