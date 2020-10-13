import React from 'react'
import { HashRouter } from 'react-router-dom'
import { Main } from '@1hive/1hive-ui'
import MainView from './components/MainView'
import Routes from './Routes'

import { AppStateProvider } from './providers/AppState'
import { ProfileProvider } from './providers/Profile'
import { WalletProvider } from './providers/Wallet'

function App() {
  return (
    <WalletProvider>
      <ProfileProvider>
        <AppStateProvider>
          <Main assetsUrl="/aragon-ui/" layout={false} scrollView={false}>
            <HashRouter>
              <MainView>
                <Routes />
              </MainView>
            </HashRouter>
          </Main>
        </AppStateProvider>
      </ProfileProvider>
    </WalletProvider>
  )
}

export default App
