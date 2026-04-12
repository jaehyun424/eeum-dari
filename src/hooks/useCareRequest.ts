'use client';

import { useState } from 'react';
import type { CareRequestFormData } from '@/lib/types/forms';

const TOTAL_STEPS = 6;

export function useCareRequest() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CareRequestFormData>>({});

  const goToStep = (step: number) => {
    if (step >= 1 && step <= TOTAL_STEPS) {
      setCurrentStep(step);
    }
  };

  const nextStep = () => goToStep(currentStep + 1);
  const prevStep = () => goToStep(currentStep - 1);

  const updateFormData = (data: Partial<CareRequestFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === TOTAL_STEPS;
  const progress = (currentStep / TOTAL_STEPS) * 100;

  return {
    currentStep,
    totalSteps: TOTAL_STEPS,
    formData,
    goToStep,
    nextStep,
    prevStep,
    updateFormData,
    isFirstStep,
    isLastStep,
    progress,
  };
}
