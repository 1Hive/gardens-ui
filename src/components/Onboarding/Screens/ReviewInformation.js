import React from 'react'
import { useOnboardingState } from '@providers/Onboarding'
import Navigation from '../Navigation'

function ReviewInformation({ title }) {
  const { onBack, onNext } = useOnboardingState()

  return (
    <div>
      {title}
      <Navigation
        backEnabled
        nextEnabled
        nextLabel="Launch your garden"
        onBack={onBack}
        onNext={onNext}
      />
    </div>
  )
}

export default ReviewInformation
