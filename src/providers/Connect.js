import React from 'react'
import { Connect } from '@1hive/connect-react'

import { useGardens } from './Gardens'
import { getNetwork } from '../networks'

function ConnectProvider({ children }) {
  const { connectedGarden } = useGardens()

  return (
    <Connect
      location={connectedGarden.address}
      connector="thegraph"
      options={{
        network: getNetwork().chainId,
        ipfs: 'https://ipfs.io/ipfs/{cid}{path}',
      }}
    >
      {children}
    </Connect>
  )
}

export { ConnectProvider }
