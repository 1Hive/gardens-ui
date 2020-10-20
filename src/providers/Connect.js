import React from 'react'
import { Connect } from '@aragon/connect-react'

import { getDefaultChain } from '../local-settings'
import { getNetwork } from '../networks'

function ConnectProvider({ children }) {
  const orgAddress = getNetwork().honeypot

  return (
    <Connect
      location={orgAddress}
      connector="thegraph"
      options={{
        network: getDefaultChain(),
      }}
    >
      {children}
    </Connect>
  )
}

export { ConnectProvider }
