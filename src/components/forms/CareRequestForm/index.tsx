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

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/matching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ careRequestId: SUBMITTED_REQUEST_ID }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? '매칭 요청에 실패했습니다.');
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
