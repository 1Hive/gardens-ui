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
      <AppStateProvider>
        <ProfileProvider>
          <Main assetsUrl="/aragon-ui/" layout={false}>
            <HashRouter>
              <MainView>
                <Routes />
              </MainView>
            </HashRouter>
          </Main>
        </ProfileProvider>
      </AppStateProvider>
    </WalletProvider>
  )
}

export default App
