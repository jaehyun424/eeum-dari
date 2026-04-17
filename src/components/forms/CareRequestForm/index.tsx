'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCareRequest } from '@/hooks/useCareRequest';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';
import type { CareRequestFormData } from '@/lib/types/forms';
import { HospitalStep } from './HospitalStep';
import { PatientStep } from './PatientStep';
import { CareItemsStep } from './CareItemsStep';
import { RiskFlagsStep } from './RiskFlagsStep';
import { PreferencesStep } from './PreferencesStep';
import { ReviewStep } from './ReviewStep';

const steps = [
  { label: '병원 선택', component: HospitalStep },
  { label: '환자 정보', component: PatientStep },
  { label: '케어 항목', component: CareItemsStep },
  { label: '위험 사항', component: RiskFlagsStep },
  { label: '선호사항', component: PreferencesStep },
  { label: '확인', component: ReviewStep },
];

// 신청 폼은 API에 직접 formData 페이로드를 보내고, 서버가 생성한 id로 이동한다.
// 고정 ID는 쓰지 않는다 — 각 요청은 unique id를 서버에서 발급.

function isFutureDate(isoDate: string): boolean {
  if (!isoDate) return false;
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d.getTime() >= today.getTime();
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 9 && digits.length <= 11;
}

export function CareRequestForm() {
  const router = useRouter();
  const {
    currentStep,
    totalSteps,
    formData,
    nextStep,
    prevStep,
    updateFormData,
    isFirstStep,
    isLastStep,
    progress,
  } = useCareRequest();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastError, setToastError] = useState<string | null>(null);

  const StepComponent = steps[currentStep - 1].component;

  const isSubmitDisabled =
    (isLastStep && formData.sensitiveInfoConsent !== true) || isSubmitting;

  // 제출 직전 이중 방어 — 각 step UI가 이미 검증하지만 여기서도 재검사
  const validateBeforeSubmit = (): string | null => {
    if (!formData.hospitalId) {
      return '병원을 선택해주세요';
    }
    if (!formData.patientName || formData.patientName.trim() === '') {
      return '환자 이름을 입력해주세요';
    }
    if (
      typeof formData.patientAge !== 'number' ||
      formData.patientAge <= 0 ||
      formData.patientAge > 150
    ) {
      return '환자 나이를 올바르게 입력해주세요';
    }
    if (!formData.patientGender) {
      return '환자 성별을 선택해주세요';
    }
    if (!formData.careItems || formData.careItems.length === 0) {
      return '간병 항목을 최소 1개 선택해주세요';
    }
    if (!formData.careStartDate) {
      return '간병 시작일을 입력해주세요';
    }
    if (!isFutureDate(formData.careStartDate)) {
      return '간병 시작일은 오늘 이후로 설정해주세요';
    }
    if (
      !formData.endDateUndecided &&
      formData.careEndDate &&
      new Date(formData.careEndDate) < new Date(formData.careStartDate)
    ) {
      return '종료일은 시작일 이후여야 합니다';
    }
    if (formData.guardianPhone && !isValidPhone(formData.guardianPhone)) {
      return '올바른 연락처를 입력해주세요';
    }
    if (formData.sensitiveInfoConsent !== true) {
      return '민감정보 수집 동의가 필요합니다';
    }
    return null;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const validationError = validateBeforeSubmit();
    if (validationError !== null) {
      setToastError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        formData: {
          hospitalId: formData.hospitalId,
          patientName: formData.patientName,
          patientAge: formData.patientAge,
          patientGender: formData.patientGender,
          careItems: formData.careItems,
          riskFlags: formData.riskFlags ?? [],
          preferredGender: formData.preferredGender ?? 'any',
          careStartDate: formData.careStartDate,
          careEndDate: formData.careEndDate,
          nightCareNeeded: formData.nightCareNeeded ?? false,
          mobilityLevel: formData.mobilityLevel,
          additionalNotes: formData.additionalNotes,
        },
      };

      let res: Response;
      try {
        res = await fetch('/api/matching', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch {
        throw new Error('네트워크 연결을 확인해주세요');
      }

      if (!res.ok) {
        if (res.status >= 500) {
          throw new Error(
            '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요',
          );
        }
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? '잘못된 요청입니다');
      }

      const data = await res.json();
      const newId: string | undefined = data.careRequestId;
      if (!newId) {
        throw new Error('매칭 요청 ID를 받지 못했습니다');
      }

      // Vercel serverless 환경에서 runtime store가 리셋되어도 복구할 수 있도록
      // sessionStorage에 방금 제출한 formData를 id로 키잉해서 저장.
      try {
        persistSubmittedFormData(newId, payload.formData);
      } catch {
        // quota/private mode 등 storage 실패는 silent — 매칭 결과 페이지에서
        // 서버 runtime store/mock fallback으로 동작한다.
      }

      router.push(`/guardian/matching/${newId}`);
    } catch (err) {
      setToastError(
        err instanceof Error
          ? err.message
          : '매칭 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      );
      setIsSubmitting(false);
    }
  };

  const handlePrimary = () => {
    if (isLastStep) {
      handleSubmit();
    } else {
      nextStep();
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, index) => (
            <span
              key={step.label}
              className={`hidden sm:inline text-xs font-medium ${
                index + 1 <= currentStep ? 'text-brand-600' : 'text-muted'
              }`}
            >
              {step.label}
            </span>
          ))}
          <span className="sm:hidden text-sm font-semibold text-brand-600">
            {currentStep} / {totalSteps}
          </span>
        </div>
        <div className="h-2 rounded-full bg-warm-gray-200 dark:bg-warm-gray-800">
          <div
            className="h-full rounded-full bg-brand-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-muted text-right hidden sm:block">
          {currentStep} / {totalSteps}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
        >
          <StepComponent formData={formData} onUpdate={updateFormData} />
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex justify-between">
        <Button
          variant="outline"
          size="lg"
          className="h-[48px] px-6"
          onClick={prevStep}
          disabled={isFirstStep || isSubmitting}
        >
          이전
        </Button>
        <Button
          variant="primary"
          size="lg"
          className="h-[48px] px-8"
          onClick={handlePrimary}
          disabled={isSubmitDisabled}
          isLoading={isSubmitting}
        >
          {isLastStep ? (isSubmitting ? '처리 중...' : '신청하기') : '다음'}
        </Button>
      </div>

      <Toast
        type="error"
        message={toastError ?? ''}
        isVisible={toastError !== null}
        onClose={() => setToastError(null)}
      />
    </div>
  );
}

function persistSubmittedFormData(
  id: string,
  formData: Partial<CareRequestFormData>,
) {
  if (typeof window === 'undefined') return;
  const key = `eeum:careRequest:${id}`;
  window.sessionStorage.setItem(
    key,
    JSON.stringify({ id, formData, ts: Date.now() }),
  );
  window.sessionStorage.setItem('eeum:lastRequestId', id);
}
