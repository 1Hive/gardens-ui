import React from 'react'
import { Button } from '@1hive/1hive-ui'
import { useOnboardingState } from '@providers/Onboarding'
import Navigation from '../Navigation'
import { commitNewDao } from '../../../services/gihub'

function GardenMetadata() {
  const { onBack, onNext } = useOnboardingState()

  return (
    <div>
      GardenMetadata
      <Button onClick={commitNewDao}> TEST </Button>
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
