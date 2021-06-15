import React from 'react'
import { OnboardingProvider } from '@providers/Onboarding'
import Screens from './Screens'

function Onboarding() {
  return (
    <OnboardingProvider>
      <Screens />
    </OnboardingProvider>
  )
}

export default Onboarding
