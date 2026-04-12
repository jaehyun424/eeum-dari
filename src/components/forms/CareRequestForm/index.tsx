'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCareRequest } from '@/hooks/useCareRequest';
import { Button } from '@/components/ui/Button';
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

export function CareRequestForm() {
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

  const StepComponent = steps[currentStep - 1].component;

  const isSubmitDisabled =
    isLastStep && formData.sensitiveInfoConsent !== true;

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {/* Desktop: show labels */}
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
          {/* Mobile: show step number */}
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
          disabled={isFirstStep}
        >
          이전
        </Button>
        <Button
          variant="primary"
          size="lg"
          className="h-[48px] px-8"
          onClick={nextStep}
          disabled={isSubmitDisabled}
        >
          {isLastStep ? '신청하기' : '다음'}
        </Button>
      </div>
    </div>
  );
}
