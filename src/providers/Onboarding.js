import React, { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { Screens } from '@components/Onboarding/Screens/config'

const OnboardingContext = React.createContext()

const stepsLength = Screens.length

function OnboardingProvider({ children }) {
  const [step, setStep] = useState(0)

  const handleBack = useCallback(() => {
    setStep(index => Math.max(0, index - 1))
  }, [])

  const handleNext = useCallback(() => {
    setStep(index => Math.min(stepsLength - 1, index + 1))
  }, [])

  return (
    <OnboardingContext.Provider
      value={{
        onBack: handleBack,
        onNext: handleNext,
        step,
        stepsLength,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

OnboardingProvider.propTypes = {
  children: PropTypes.node,
}

function useOnboardingState() {
  return useContext(OnboardingContext)
}

export { OnboardingProvider, useOnboardingState }
