import React from 'react'
import Routes from './Routes'
import { AgreementSubscriptionProvider } from '../providers/AgreementSubscription'
import { AppStateProvider } from '../providers/AppState'

import { StakingProvider } from '../providers/Staking'
import { ConnectProvider as Connect } from '../providers/Connect'
import { useDAO } from '../providers/Dao'

import { DAONotFound } from '../errors'

function GardenHome({ match }) {
  const { connectedDAO } = useDAO()

  if (!connectedDAO) {
    throw new DAONotFound(match.params.daoId)
  }
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
