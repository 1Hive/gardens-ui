import React from 'react'
import { useOnboardingState } from '@providers/Onboarding'
import Navigation from '../Navigation'

function HoneyswapLiquidity() {
  const { onBack, onNext } = useOnboardingState()

  return (
    <div>
      Honeyswap
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

export default HoneyswapLiquidity
