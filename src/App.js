import React from 'react'
import { HashRouter } from 'react-router-dom'
import { Main } from '@1hive/1hive-ui'
import MainView from './components/MainView'
import Routes from './Routes'
import GlobalErrorHandler from './GlobalErrorHandler'
import { WalletProvider } from './providers/Wallet'
import { ProfileProvider } from './providers/Profile'

function App() {
  return (
    <GlobalErrorHandler>
      <HashRouter>
        <WalletProvider>
          <ProfileProvider>
            <Main assetsUrl="/aragon-ui/" layout={false} scrollView={false}>
              <MainView>
                <Routes />
              </MainView>
            </Main>
          </ProfileProvider>
        </WalletProvider>
      </HashRouter>
    </GlobalErrorHandler>
  )
}

export default App
