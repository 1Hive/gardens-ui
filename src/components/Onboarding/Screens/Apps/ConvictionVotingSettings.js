import React from 'react'
import { useOnboardingState } from '@providers/Onboarding'
import Navigation from '../../Navigation'

function ConvictionVotingSettings() {
  const { onBack, onNext } = useOnboardingState()

  return (
    <div>
      Conviction voting settings
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

export default ConvictionVotingSettings
