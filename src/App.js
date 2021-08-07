import React from 'react'
import { HashRouter } from 'react-router-dom'
import { IntercomProvider } from 'react-use-intercom'
import { Main, ToastHub } from '@1hive/1hive-ui'
import MainView from '@components/MainView'
import Routes from './routes/Routes'
import GlobalErrorHandler from './GlobalErrorHandler'
import { GardensProvider } from './providers/Gardens'
import { WalletProvider } from './providers/Wallet'
import { ProfileProvider } from './providers/Profile'
import env from './environment'

function App() {
  return (
    <HashRouter>
      <IntercomProvider appId={env('INTERCOM_APP_ID')} autoBoot>
        <Main assetsUrl="/aragon-ui/" layout={false} scrollView={false}>
          <GlobalErrorHandler>
            <ToastHub threshold={1} timeout={1500}>
              <WalletProvider>
                <ProfileProvider>
                  <GardensProvider>
                    <MainView>
                      <Routes />
                    </MainView>
                  </GardensProvider>
                </ProfileProvider>
              </WalletProvider>
            </ToastHub>
          </GlobalErrorHandler>
        </Main>
      </IntercomProvider>
    </HashRouter>
  )
}

export default App
