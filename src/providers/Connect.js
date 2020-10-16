import React from 'react'
import { Connect } from '@aragon/connect-react'

import { useWallet } from './Wallet'
import { getDefaultChain } from '../local-settings'
import { getNetwork } from '../networks'

function ConnectProvider({ children }) {
  const { ethereum, ethers } = useWallet()
  const orgAddress = getNetwork().honeypot

  return (
    <Connect
      location={orgAddress}
      connector="thegraph"
      options={{
        name: ethereum || ethers,
        network: getDefaultChain(),
      }}
    >
      {children}
    </Connect>
  )
}

export { ConnectProvider }
