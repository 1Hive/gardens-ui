import React from 'react'
import { HashRouter } from 'react-router-dom'
import { Main } from '@1hive/1hive-ui'
import MainView from './components/MainView'
import Routes from './Routes'
import GlobalErrorHandler from './GlobalErrorHandler'
// import { AgreementSubscriptionProvider } from './providers/AgreementSubscription'
// import { AppStateProvider } from './providers/AppState'
// import { ProfileProvider } from './providers/Profile'
// import { DAOProvider } from './providers/Dao'
// import { StakingProvider } from './providers/Staking'
import { WalletProvider } from './providers/Wallet'
import { ProfileProvider } from './providers/Profile'
// import { ConnectProvider as Connect } from './providers/Connect'

function App() {
  return (
    <GlobalErrorHandler>
      <HashRouter>
        {/* <DAOProvider> */}
        <WalletProvider>
          <ProfileProvider>
            <Main assetsUrl="/aragon-ui/" layout={false} scrollView={false}>
              <MainView>
                <Routes />
              </MainView>
            </Main>
          </ProfileProvider>
        </WalletProvider>
        {/* </DAOProvider> */}
      </HashRouter>
    </GlobalErrorHandler>
  )
}

export default App
