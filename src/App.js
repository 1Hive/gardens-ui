import React from 'react'
import { HashRouter } from 'react-router-dom'
import { IntercomProvider } from 'react-use-intercom'
import { Main } from '@1hive/1hive-ui'
import MainView from '@components/MainView'
import Routes from './routes/Routes'
import GlobalErrorHandler from './GlobalErrorHandler'
import { GardensProvider } from './providers/Gardens'
import { WalletProvider } from './providers/Wallet'
import { ProfileProvider } from './providers/Profile'
import env from './environment'

function App() {
  return (
    <GlobalErrorHandler>
      <HashRouter>
        <WalletProvider>
          <IntercomProvider appId={env('INTERCOM_APP_ID')} autoBoot>
            <ProfileProvider>
              <Main assetsUrl="/aragon-ui/" layout={false} scrollView={false}>
                <GardensProvider>
                  <MainView>
                    <Routes />
                  </MainView>
                </GardensProvider>
              </Main>
            </ProfileProvider>
          </IntercomProvider>
        </WalletProvider>
      </HashRouter>
    </GlobalErrorHandler>
  )
}

export default App
