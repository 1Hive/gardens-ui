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
import { ChartsProvider } from '@providers/Charts'
import env from './environment'

function App() {
  return (
    <HashRouter>
      <IntercomProvider appId={env('INTERCOM_APP_ID')} autoBoot>
        <Main assetsUrl="/aragon-ui/" layout={false} scrollView={false}>
          <GlobalErrorHandler>
            <WalletProvider>
              <ProfileProvider>
                <GardensProvider>
                  <ChartsProvider>
                    <MainView>
                      <Routes />
                    </MainView>
                  </ChartsProvider>
                </GardensProvider>
              </ProfileProvider>
            </WalletProvider>
          </GlobalErrorHandler>
        </Main>
      </IntercomProvider>
    </HashRouter>
  )
}

export default App
