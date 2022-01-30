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

async function connect(): Promise<AuthProvider> {
  const web3Modal = new Web3Modal({
    network: 'rinkeby',
    cacheProvider: false,
    providerOptions: {
      injected: {
        package: null,
      },
    },
  })
  const provider = await web3Modal.connect()
  const web3 = new Web3(provider)
  const accounts = await web3.eth.getAccounts()
  return new EthereumAuthProvider(provider, accounts[0])
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
