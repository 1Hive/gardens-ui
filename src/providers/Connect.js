import React from 'react'
import { Connect } from '@1hive/connect-react'

import { useGardens } from './Gardens'
import { useWallet } from './Wallet'

import { getNetwork } from '../networks'

function ConnectProvider({ children }) {
  const { connectedGarden } = useGardens()
  const { preferredNetwork } = useWallet()

  const { subgraphs } = getNetwork(preferredNetwork)

  return (
    <Connect
      location={connectedGarden.address}
      connector={[
        'thegraph',
        {
          orgSubgraphUrl: subgraphs.aragon,
        },
      ]}
      options={{
        network: preferredNetwork,
        ipfs: 'https://ipfs.io/ipfs/{cid}{path}',
      }}
    >
      {children}
    </Connect>
  )
}

export { ConnectProvider }
