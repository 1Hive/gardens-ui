import React from 'react'
import GlobalErrorHandler from './GlobalErrorHandler'
import { GardensProvider } from './providers/Gardens'
import { ProfileProvider } from './providers/Profile'
import { UserProvider } from './providers/User'
import { WalletProvider } from './providers/Wallet'
import Routes from './routes/Routes'
import { Main } from '@1hive/1hive-ui'
import MainView from '@components/MainView'
import WelcomeLoader from '@components/Welcome/WelcomeLoader'
import { HashRouter } from 'react-router-dom'
import { CeramicProvider, Networks } from 'use-ceramic'
import Web3 from 'web3'
import Web3Modal from 'web3modal'
import { AuthProvider, EthereumAuthProvider } from '@3id/connect'

const INFURA_TOKEN = process.env.NEXT_PUBLIC_INFURA_TOKEN

async function connect(): Promise<AuthProvider> {
  return new EthereumAuthProvider(
    window.ethereum,
    '0x3CeeF2C35d55a61514CeCe32C165fB96536d76c4'
  )
}

function App() {
  return (
    <HashRouter>
      <Main assetsUrl="/aragon-ui/" layout={false} scrollView={false}>
        <WalletProvider>
          <GlobalErrorHandler>
            <CeramicProvider network={Networks.MAINNET} connect={connect}>
              <ProfileProvider>
                <UserProvider>
                  <GardensProvider>
                    <WelcomeLoader />
                    <MainView>
                      <Routes />
                    </MainView>
                  </GardensProvider>
                </UserProvider>
              </ProfileProvider>
            </CeramicProvider>
          </GlobalErrorHandler>
        </WalletProvider>
      </Main>
    </HashRouter>
  )
}

export default App
