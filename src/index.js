import React from 'react'
import ReactDOM from 'react-dom'
import { AragonApi } from '@aragon/api-react'
import App from './App'
import { IdentityProvider } from './identity-manager'
import reducer from './app-state-reducer.js'
import { WalletProvider } from './providers/Wallet'

ReactDOM.render(
  <AragonApi reducer={reducer}>
    <IdentityProvider>
      <WalletProvider>
        <App />
      </WalletProvider>
    </IdentityProvider>
  </AragonApi>,
  document.getElementById('root')
)
