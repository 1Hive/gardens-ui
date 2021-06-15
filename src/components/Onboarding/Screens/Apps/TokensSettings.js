import React from 'react'
import { useOnboardingState } from '@providers/Onboarding'
import Navigation from '../../Navigation'

function TokensSettings() {
  const { onBack, onNext } = useOnboardingState()

  return (
    <div>
      Tokens settings
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

export default TokensSettings
