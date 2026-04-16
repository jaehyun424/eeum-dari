'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCareRequest } from '@/hooks/useCareRequest';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';
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

// 신청이 제출되면 Mock으로 이 ID를 사용해 매칭 페이지로 이동
const SUBMITTED_REQUEST_ID = 'req-1';

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

  // 제출 직전 formData 유효성 재확인
  // UI 단계에서 막혀야 하지만, 이중 방어로 여기서도 검사한다
  const validateBeforeSubmit = (): string | null => {
    if (!formData.patientName || formData.patientName.trim() === '') {
      return '환자 이름을 입력해주세요';
    }
    if (!formData.careItems || formData.careItems.length === 0) {
      return '간병 항목을 최소 1개 선택해주세요';
    }
    if (formData.sensitiveInfoConsent !== true) {
      return '민감정보 수집 동의가 필요합니다';
    }
    return null;
  };

  const handleSubmit = async () => {
    // 중복 제출 방지 — 이미 진행 중이면 경고만 남기고 무시
    if (isSubmitting) {
      console.warn('[CareRequestForm] Duplicate submit blocked');
      return;
    }

    const validationError = validateBeforeSubmit();
    if (validationError !== null) {
      setToastError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      let res: Response;
      try {
        res = await fetch('/api/matching', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ careRequestId: SUBMITTED_REQUEST_ID }),
        });
      } catch {
        // fetch 자체 실패 — 오프라인/DNS/CORS 등 네트워크 계층 오류
        throw new Error('네트워크 연결을 확인해주세요');
      }

      if (!res.ok) {
        if (res.status >= 500) {
          // 서버 장애 — 사용자에게는 구체 메시지 숨김
          throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요');
        }
        // 4xx — 응답 body의 error 필드를 그대로 표시
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? '잘못된 요청입니다');
      }

      router.push(`/guardian/matching/${SUBMITTED_REQUEST_ID}`);
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
      {/* Progress Bar */}
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

      {/* Step Content with animation */}
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

      {/* Navigation */}
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
