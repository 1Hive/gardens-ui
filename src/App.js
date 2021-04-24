import React from 'react'
import { HashRouter } from 'react-router-dom'
import { Main } from '@1hive/1hive-ui'
import MainView from './components/MainView'
import Routes from './Routes'

import { ProfileProvider } from './providers/Profile'
import { WalletProvider } from './providers/Wallet'

function App() {
  return (
    <WalletProvider>
      <ProfileProvider>
        <Main assetsUrl="/aragon-ui/" layout={false} scrollView={false}>
          <HashRouter>
            <MainView>
              <Routes />
            </MainView>
          </HashRouter>
        </Main>
      </ProfileProvider>
    </WalletProvider>
  )
}

export default App
