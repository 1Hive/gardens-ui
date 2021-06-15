import React from 'react'
import { useOnboardingState } from '@providers/Onboarding'
import Navigation from '../Navigation'

function GardenTypeSelector() {
  const { onBack, onNext } = useOnboardingState()

  return (
    <div>
      Garden type
      <Navigation
        backEnabled={false}
        nextEnabled
        nextLabel="Next:"
        onBack={onBack}
        onNext={onNext}
      />
    </div>
  )
}

export default GardenTypeSelector
