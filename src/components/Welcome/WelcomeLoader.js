import React, { useCallback, useState } from 'react'
import WelcomeModal from './WelcomeModal'

function OnboardingLoader({ children }) {
  const [onboardingCompleted, setOnboardingCompleted] = useState(
    localStorage.getItem('onboardingCompleted') === 'true'
  )

  const handleOnComplete = useCallback(() => {
    localStorage.setItem('onboardingCompleted', 'true')
    setOnboardingCompleted(true)
  }, [])

  return (
    <React.Fragment>
      <WelcomeModal
        onComplete={handleOnComplete}
        visible={!onboardingCompleted}
      />
      {children}
    </React.Fragment>
  )
}

export default OnboardingLoader
