import React, { useMemo } from 'react'
import StepItem from './StepsItem'
import { useOnboardingState } from '@providers/Onboarding'

function Step({ currentStep, label, step, stepNumber, substeps }) {
  const { step: onboardingStep } = useOnboardingState()
  const [displayedSubsteps] = useMemo(() => {
    const displayedSubsteps = substeps.map((step, index) => {
      if (substeps.length > 0) {
        const label = step[0].title

        const statusIndex = step[1]
        return [statusIndex, index, label]
      }
    }, [])
    return [displayedSubsteps, step]
  }, [substeps, step])
  return (
    <>
      <StepItem
        type="step"
        currentStep={currentStep}
        label={label}
        step={step}
        stepNumber={stepNumber}
      />
      {currentStep === step &&
        displayedSubsteps.map(([statusIndex, index, label], indexInternal) => {
          return (
            <StepItem
              key={indexInternal}
              type="substep"
              currentStep={onboardingStep}
              label={label}
              step={statusIndex}
              stepNumber={indexInternal + 1}
            />
          )
        })}
    </>
  )
}

export default Step
