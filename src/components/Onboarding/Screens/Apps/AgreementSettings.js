import React from 'react'
import { useOnboardingState } from '@providers/Onboarding'
import Navigation from '../../Navigation'

function AgreementSettings() {
  const { onBack, onNext } = useOnboardingState()

  return (
    <div>
      Agreement settings
      <Navigation
        backEnabled
        nextEnabled
        nextLabel="Next:"
        onBack={onBack}
        onNext={onNext}
      />
    </div>
  )
}

export default AgreementSettings
