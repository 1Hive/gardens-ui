import React from 'react'
import { HashRouter } from 'react-router-dom'
import { Main } from '@1hive/1hive-ui'
import MainView from '@components/MainView'
import Routes from './routes/Routes'
import GlobalErrorHandler from './GlobalErrorHandler'
import { GardensProvider } from './providers/Gardens'
import { WalletProvider } from './providers/Wallet'
import { ProfileProvider } from './providers/Profile'

function App() {
  return (
    <GlobalErrorHandler>
      <HashRouter>
        <WalletProvider>
          <ProfileProvider>
            <Main assetsUrl="/aragon-ui/" layout={false} scrollView={false}>
              <GardensProvider>
                <MainView>
                  <Routes />
                </MainView>
              </GardensProvider>
            </Main>
          </ProfileProvider>
        </WalletProvider>
      </HashRouter>
    </GlobalErrorHandler>
  )
}

export default App
