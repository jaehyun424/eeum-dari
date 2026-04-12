'use client';

import { useState } from 'react';
import type { CareRequestFormData } from '@/lib/types/forms';
import { hospitals } from '@/lib/constants/hospitals';
import { careItems } from '@/lib/constants/care-items';
import { riskFlags } from '@/lib/constants/risk-flags';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface StepProps {
  formData: Partial<CareRequestFormData>;
  onUpdate: (data: Partial<CareRequestFormData>) => void;
}

const mobilityLabels: Record<string, string> = {
  independent: '독립보행',
  assisted: '부축필요',
  wheelchair: '휠체어',
  bedridden: '와상',
};

const positionChangeLabels: Record<string, string> = {
  none: '필요없음',
  '2h': '2시간',
  '4h': '4시간',
  medical: '의료진지시',
};

const relationLabels: Record<string, string> = {
  spouse: '배우자',
  child: '자녀',
  sibling: '형제자매',
  other: '기타',
};

export function ReviewStep({ formData, onUpdate }: StepProps) {
  const [consentModalOpen, setConsentModalOpen] = useState(false);

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
      <p className="text-base text-muted">입력하신 내용을 확인해주세요.</p>

      <div className="space-y-4">
        <Section title="병원 정보">
          <p className="text-base">{hospital?.name ?? '-'}</p>
          <p className="text-sm text-muted">{hospital?.address}</p>
        </Section>

        <Section title="환자 정보">
          <p className="text-base">이름: {formData.patientName ?? '-'}</p>
          <p className="text-base">나이: {formData.patientAge ?? '-'}세</p>
          <p className="text-base">
            성별:{' '}
            {formData.patientGender === 'male'
              ? '남성'
              : formData.patientGender === 'female'
                ? '여성'
                : '-'}
          </p>
          {formData.patientWeight && (
            <p className="text-base">체중: {formData.patientWeight}kg</p>
          )}
          {formData.mobilityLevel && (
            <p className="text-base">
              거동 수준: {mobilityLabels[formData.mobilityLevel]}
            </p>
          )}
          {formData.positionChangeFreq && (
            <p className="text-base">
              체위변경: {positionChangeLabels[formData.positionChangeFreq]}
            </p>
          )}
        </Section>

        <Section title="케어 항목">
          {selectedCareItems.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-base">
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
            <ul className="list-disc list-inside space-y-1 text-base">
              {selectedRiskFlags.map((flag) => (
                <li key={flag.id}>
                  {flag.label}
                  {flag.danger && (
                    <span className="ml-1 text-sm text-danger">
                      (의료행위 경계)
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">해당 없음</p>
          )}
        </Section>

        <Section title="일정 및 선호사항">
          <p className="text-base">
            기간: {formData.careStartDate ?? '-'} ~{' '}
            {formData.endDateUndecided ? '미정' : (formData.careEndDate || '-')}
          </p>
          <p className="text-base">
            간병인 성별:{' '}
            {formData.preferredGender === 'any'
              ? '무관'
              : formData.preferredGender === 'male'
                ? '남성'
                : formData.preferredGender === 'female'
                  ? '여성'
                  : '-'}
          </p>
          {formData.nightCareNeeded !== undefined && (
            <p className="text-base">
              야간케어: {formData.nightCareNeeded ? '필요' : '불필요'}
            </p>
          )}
        </Section>

        {(formData.guardianName || formData.guardianPhone) && (
          <Section title="보호자 정보">
            {formData.guardianName && (
              <p className="text-base">이름: {formData.guardianName}</p>
            )}
            {formData.guardianPhone && (
              <p className="text-base">연락처: {formData.guardianPhone}</p>
            )}
            {formData.guardianRelation && (
              <p className="text-base">
                관계: {relationLabels[formData.guardianRelation]}
              </p>
            )}
          </Section>
        )}

        {formData.additionalNotes && (
          <Section title="추가 요청사항">
            <p className="text-base">{formData.additionalNotes}</p>
          </Section>
        )}
      </div>

      {/* Sensitive info consent */}
      <div className="rounded-lg border border-border p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={formData.sensitiveInfoConsent ?? false}
            onChange={(e) =>
              onUpdate({ sensitiveInfoConsent: e.target.checked })
            }
            className="mt-1 h-5 w-5 shrink-0 rounded border-border accent-brand-600"
          />
          <span className="text-base text-foreground">
            <span className="text-danger font-medium">[필수]</span>{' '}
            민감정보(건강 상태, 질병 정보) 수집 및 이용에 동의합니다.{' '}
            <button
              type="button"
              onClick={() => setConsentModalOpen(true)}
              className="text-brand-600 underline hover:text-brand-700"
            >
              상세보기
            </button>
          </span>
        </label>
      </div>

      {/* Consent detail modal */}
      <Modal
        isOpen={consentModalOpen}
        onClose={() => setConsentModalOpen(false)}
        title="민감정보 수집 및 이용 동의"
      >
        <div className="space-y-4 text-base text-foreground">
          <div>
            <p className="font-semibold">1. 수집 항목</p>
            <p className="text-muted">
              환자의 건강 상태, 질병명, 거동 수준, 위험 요인 등 건강 관련 정보
            </p>
          </div>
          <div>
            <p className="font-semibold">2. 수집 목적</p>
            <p className="text-muted">
              적합한 간병인 매칭 및 안전한 간병 서비스 제공
            </p>
          </div>
          <div>
            <p className="font-semibold">3. 보유 기간</p>
            <p className="text-muted">
              서비스 종료 후 3년 (의료법 시행규칙 준용)
            </p>
          </div>
          <div>
            <p className="font-semibold">4. 동의 거부 시</p>
            <p className="text-muted">
              간병 신청 서비스 이용이 제한됩니다.
            </p>
          </div>
          <p className="text-sm text-muted border-t border-border pt-4">
            개인정보보호법 제23조에 따라 민감정보의 처리에 대한 별도 동의를
            받습니다.
          </p>
          <div className="flex justify-end">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setConsentModalOpen(false)}
            >
              확인
            </Button>
          </div>
        </div>
      </Modal>
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
