import React from 'react'
import { Connect } from '@1hive/connect-react'

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
        ipfs: 'https://ipfs.io/ipfs/{cid}{path}',
      }}
    >
      {children}
    </Connect>
  )
}

export { ConnectProvider }
