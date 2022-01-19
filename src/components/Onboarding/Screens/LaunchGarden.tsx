import React from 'react'
import { useOnboardingState } from '@providers/Onboarding'
import Navigation from '../Navigation'

type LaunchGardenProps = {
  title: string
}

function LaunchGarden({ title }: LaunchGardenProps) {
  const { onBack, onNext } = useOnboardingState()

  useEffect(() => {
    const onboardingWizardHeaderEl = document.getElementById(
      'onboarding-wizard-header'
    )

    onboardingWizardHeaderEl.scrollIntoView({
      behaviour: 'smooth',
      block: 'start',
    })
  }, [])

  return (
    <div id="onboarding-wizard-header">
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
