'use client';

import type { CareRequestFormData } from '@/lib/types/forms';
import { hospitals } from '@/lib/constants/hospitals';

interface StepProps {
  formData: Partial<CareRequestFormData>;
  onUpdate: (data: Partial<CareRequestFormData>) => void;
}

export function HospitalStep({ formData, onUpdate }: StepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">병원 선택</h2>
      <p className="text-sm text-muted">간병이 필요한 병원을 선택해주세요.</p>
      <div className="space-y-2">
        {hospitals.map((hospital) => (
          <label
            key={hospital.id}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
              formData.hospitalId === hospital.id
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-950'
                : 'border-border hover:bg-surface-hover'
            }`}
          >
            <input
              type="radio"
              name="hospital"
              value={hospital.id}
              checked={formData.hospitalId === hospital.id}
              onChange={() => onUpdate({ hospitalId: hospital.id })}
              className="sr-only"
            />
            <div>
              <p className="font-medium text-foreground">{hospital.name}</p>
              <p className="text-sm text-muted">{hospital.address}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
