import React from 'react'
import { Main } from '@1hive/1hive-ui'
import { withRouter } from 'next/router'

import { AppProps } from 'next/app'

import { UserProvider } from '@/providers/User'
import { WalletProvider } from '@/providers/Wallet'
import { GardensProvider } from '@/providers/Gardens'
import { ProfileProvider } from '@/providers/Profile'

import GlobalErrorHandler from '@/GlobalErrorHandler'

import MainView from '@/components/MainView'
import WelcomeLoader from '@/components/Welcome/WelcomeLoader'
import { AppThemeProvider, useAppTheme } from '@/providers/AppTheme'

const GardensApp = (props: AppProps): JSX.Element => {
  const { Component, pageProps } = props
  const { appearance } = useAppTheme()

  return (
    <AppThemeProvider>
      <Main
        assetsUrl="/aragon-ui/"
        layout={false}
        scrollView={false}
        theme={appearance}
      >
        <WalletProvider>
          <GlobalErrorHandler>
            <ProfileProvider>
              <UserProvider>
                <GardensProvider>
                  <WelcomeLoader />
                  <MainView>
                    <Component {...pageProps} />
                  </MainView>
                </GardensProvider>
              </UserProvider>
            </ProfileProvider>
          </GlobalErrorHandler>
        </WalletProvider>
      </Main>
    </AppThemeProvider>
  )
}

export default withRouter(GardensApp)
