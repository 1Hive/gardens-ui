import React from 'react'
import Routes from './Routes'
import { AgreementSubscriptionProvider } from '../providers/AgreementSubscription'
import { AppStateProvider } from '../providers/AppState'

import { StakingProvider } from '../providers/Staking'
import { ConnectProvider as Connect } from '../providers/Connect'

function GardenHome() {
  return (
    <Connect>
      <AppStateProvider>
        <StakingProvider>
          <AgreementSubscriptionProvider>
            <Routes />
          </AgreementSubscriptionProvider>
        </StakingProvider>
      </AppStateProvider>
    </Connect>
  )
}

export default GardenHome
