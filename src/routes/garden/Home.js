import React from 'react'
import Routes from './Routes'
import { AgreementSubscriptionProvider } from '@providers/AgreementSubscription'

import { StakingProvider } from '@providers/Staking'
import { useGardens } from '@providers/Gardens'

function GardenHome() {
  const { loading } = useGardens()
  if (loading) {
    return null
  }

  return (
    <StakingProvider>
      <AgreementSubscriptionProvider>
        <Routes />
      </AgreementSubscriptionProvider>
    </StakingProvider>
  )
}

export default GardenHome
