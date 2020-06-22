import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import { Main } from '@aragon/ui'
import theme from './theme-conviction'
import { WalletProvider } from './providers/Wallet'
import { AppStateProvider } from './providers/AppState'

ReactDOM.render(
  <WalletProvider>
    <AppStateProvider>
      <Main theme={theme} assetsUrl="/aragon-ui/">
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Main>
    </AppStateProvider>
  </WalletProvider>,
  document.getElementById('root')
)
