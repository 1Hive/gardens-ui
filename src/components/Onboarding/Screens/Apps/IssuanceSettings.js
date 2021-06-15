import React from 'react'
import { useOnboardingState } from '@providers/Onboarding'
import Navigation from '../../Navigation'

function IssuanceSettings() {
  const { onBack, onNext } = useOnboardingState()

  return (
    <div>
      Issuance settings
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

export default IssuanceSettings
