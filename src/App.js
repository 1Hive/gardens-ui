import React from 'react'
import { HashRouter } from 'react-router-dom'
import { Main } from '@1hive/1hive-ui'

import GlobalErrorHandler from './GlobalErrorHandler'
import MainView from '@components/MainView'
import Routes from './routes/Routes'
import WelcomeLoader from '@components/Welcome/WelcomeLoader'

import { ActivityProvider } from './providers/ActivityProvider'
import { GardensProvider } from './providers/Gardens'
import { ProfileProvider } from './providers/Profile'
import { useAppTheme } from './providers/AppTheme'
import theme from './theme'
import { WalletProvider } from './providers/Wallet'

function App() {
  const { appearance } = useAppTheme()

  return (
    <HashRouter>
      <Main
        assetsUrl="/aragon-ui/"
        layout={false}
        scrollView={false}
        theme={theme[appearance]}
      >
        <GlobalErrorHandler>
          <WalletProvider>
            <ActivityProvider>
              <ProfileProvider>
                <GardensProvider>
                  <WelcomeLoader />
                  <MainView>
                    <Routes />
                  </MainView>
                </GardensProvider>
              </ProfileProvider>
            </ActivityProvider>
          </WalletProvider>
        </GlobalErrorHandler>
      </Main>
    </HashRouter>
  )
}

export default App
