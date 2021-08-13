import React from 'react'
import { Connect } from '@1hive/connect-react'

import { useGardens } from './Gardens'
import { useWallet } from './Wallet'

import { getNetwork } from '../networks'

function ConnectProvider({ children }) {
  const { connectedGarden } = useGardens()
  const { preferredNetwork } = useWallet()
  // TODO - just for testing we need to publish all  our own connect libraries modifying
  // here the endpoints https://github.com/1Hive/connect/blob/ce297ac6cb5c51daad7beac27c58b0fd1c013fd6/packages/connect-thegraph/src/connector.ts#L39
  // Or have the orgSubgraphUrl on the network file

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
