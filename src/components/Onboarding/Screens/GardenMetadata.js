import React from 'react'
import { useOnboardingState } from '@providers/Onboarding'
import Navigation from '../Navigation'

function GardenMetadata() {
  const { onBack, onNext } = useOnboardingState()

  return (
    <div>
      GardenMetadata
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

export default GardenMetadata
