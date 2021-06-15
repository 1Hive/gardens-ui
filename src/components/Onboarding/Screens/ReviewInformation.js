import React from 'react'
import { useOnboardingState } from '@providers/Onboarding'
import Navigation from '../Navigation'

function ReviewInformation() {
  const { onBack, onNext } = useOnboardingState()

  return (
    <div>
      Review information
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

export default ReviewInformation
