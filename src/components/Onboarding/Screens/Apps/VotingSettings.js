import React from 'react'
import { useOnboardingState } from '@providers/Onboarding'
import Navigation from '../../Navigation'

function VotingSettings() {
  const { onBack, onNext } = useOnboardingState()

  return (
    <div>
      VotingSettings
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

export default VotingSettings
