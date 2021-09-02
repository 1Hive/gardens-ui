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
    <HashRouter>
      <Main assetsUrl="/aragon-ui/" layout={false} scrollView={false}>
        <GlobalErrorHandler>
          <WalletProvider>
            <ProfileProvider>
              <GardensProvider>
                <MainView>
                  <Routes />
                </MainView>
              </GardensProvider>
            </ProfileProvider>
          </WalletProvider>
        </GlobalErrorHandler>
      </Main>
    </HashRouter>
  )
}

export default App
