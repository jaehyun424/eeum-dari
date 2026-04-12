'use client';

import type { CareRequestFormData } from '@/lib/types/forms';
import { hospitals } from '@/lib/constants/hospitals';
import { careItems } from '@/lib/constants/care-items';
import { riskFlags } from '@/lib/constants/risk-flags';

interface StepProps {
  formData: Partial<CareRequestFormData>;
  onUpdate: (data: Partial<CareRequestFormData>) => void;
}

export function ReviewStep({ formData }: StepProps) {
  const hospital = hospitals.find((h) => h.id === formData.hospitalId);
  const selectedCareItems = careItems.filter((item) =>
    formData.careItems?.includes(item.id),
  );
  const selectedRiskFlags = riskFlags.filter((flag) =>
    formData.riskFlags?.includes(flag.id),
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">신청 내용 확인</h2>
      <p className="text-sm text-muted">입력하신 내용을 확인해주세요.</p>

      <div className="space-y-4">
        <Section title="병원 정보">
          <p>{hospital?.name ?? '-'}</p>
          <p className="text-sm text-muted">{hospital?.address}</p>
        </Section>

        <Section title="환자 정보">
          <p>이름: {formData.patientName ?? '-'}</p>
          <p>나이: {formData.patientAge ?? '-'}세</p>
          <p>
            성별:{' '}
            {formData.patientGender === 'male'
              ? '남성'
              : formData.patientGender === 'female'
                ? '여성'
                : '-'}
          </p>
        </Section>

        <Section title="케어 항목">
          {selectedCareItems.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {selectedCareItems.map((item) => (
                <li key={item.id}>{item.label}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">선택된 항목 없음</p>
          )}
        </Section>

        <Section title="위험 사항">
          {selectedRiskFlags.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {selectedRiskFlags.map((flag) => (
                <li key={flag.id}>{flag.label}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">해당 없음</p>
          )}
        </Section>

        <Section title="일정">
          <p>
            {formData.careStartDate ?? '-'} ~ {formData.careEndDate ?? '-'}
          </p>
          <p>
            간병인 성별 선호:{' '}
            {formData.preferredGender === 'any'
              ? '무관'
              : formData.preferredGender === 'male'
                ? '남성'
                : formData.preferredGender === 'female'
                  ? '여성'
                  : '-'}
          </p>
        </Section>

        {formData.additionalNotes && (
          <Section title="추가 요청사항">
            <p>{formData.additionalNotes}</p>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border p-4">
      <h3 className="text-sm font-semibold text-muted mb-2">{title}</h3>
      <div className="text-foreground">{children}</div>
    </div>
  );
}
