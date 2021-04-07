import React from 'react'
import { HashRouter } from 'react-router-dom'
import { Main } from '@1hive/1hive-ui'
import MainView from './components/MainView'
import Routes from './Routes'

import { AgreementSubscriptionProvider } from './providers/AgreementSubscription'
import { AppStateProvider } from './providers/AppState'
import { ProfileProvider } from './providers/Profile'
import { StakingProvider } from './providers/Staking'
import { WalletProvider } from './providers/Wallet'
import { ConnectProvider as Connect } from './providers/Connect'

function App() {
  return (
    <WalletProvider>
      <Connect>
        <ProfileProvider>
          <AppStateProvider>
            <StakingProvider>
              <AgreementSubscriptionProvider>
                <Main assetsUrl="/aragon-ui/" layout={false} scrollView={false}>
                  <HashRouter>
                    <MainView>
                      <Routes />
                    </MainView>
                  </HashRouter>
                </Main>
              </AgreementSubscriptionProvider>
            </StakingProvider>
          </AppStateProvider>
        </ProfileProvider>
      </Connect>
    </WalletProvider>
  )
}

export default App
