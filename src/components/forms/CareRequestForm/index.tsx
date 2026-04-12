'use client';

import { useCareRequest } from '@/hooks/useCareRequest';
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

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, index) => (
            <span
              key={step.label}
              className={`text-xs font-medium ${
                index + 1 <= currentStep ? 'text-brand-600' : 'text-muted'
              }`}
            >
              {step.label}
            </span>
          ))}
        </div>
        <div className="h-2 rounded-full bg-warm-gray-200 dark:bg-warm-gray-800">
          <div
            className="h-full rounded-full bg-brand-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-muted text-right">
          {currentStep} / {totalSteps}
        </p>
      </div>

      {/* Step Content */}
      <StepComponent formData={formData} onUpdate={updateFormData} />

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={prevStep}
          disabled={isFirstStep}
          className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-surface-hover disabled:opacity-50 disabled:pointer-events-none transition-colors"
        >
          이전
        </button>
        <button
          onClick={nextStep}
          className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
        >
          {isLastStep ? '신청하기' : '다음'}
        </button>
      </div>
    </div>
  );
}
