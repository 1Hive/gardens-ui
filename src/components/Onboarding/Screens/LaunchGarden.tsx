import React from 'react'
import { useOnboardingState } from '@providers/Onboarding'
import Navigation from '../Navigation'

type LaunchGardenProps = {
  title: string
}

function LaunchGarden({ title }: LaunchGardenProps) {
  const { onBack, onNext } = useOnboardingState()

  return (
    <div>
      {title}
      <Navigation
        backEnabled
        nextEnabled={false}
        onBack={onBack}
        onNext={onNext}
      />
    </div>
  )
}

export default LaunchGarden
