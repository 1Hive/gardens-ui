import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'

const OnboardingContext = React.createContext()

function OnboardingProvider({ children }) {
  const [step, setStep] = useState(0)

  return (
    <OnboardingContext.Provider
      value={{
        step,
        setStep,
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
