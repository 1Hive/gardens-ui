import React from 'react'
import Routes from './Routes'
import { AgreementSubscriptionProvider } from '../providers/AgreementSubscription'
import { AppStateProvider } from '../providers/AppState'
import { DAOProvider } from '../providers/Dao'

import { StakingProvider } from '../providers/Staking'
import { ConnectProvider as Connect } from '../providers/Connect'

function GardenHome(match) {
  return (
    <DAOProvider>
      <Connect>
        <AppStateProvider>
          <StakingProvider>
            <AgreementSubscriptionProvider>
              <Routes />
            </AgreementSubscriptionProvider>
          </StakingProvider>
        </AppStateProvider>
      </Connect>
    </DAOProvider>
  )
}

export default GardenHome
