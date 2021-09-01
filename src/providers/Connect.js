import React from 'react'
import { Connect } from '@1hive/connect-react'

import { useGardens } from './Gardens'
import { getNetwork } from '../networks'

function ConnectProvider({ children }) {
  const { connectedGarden } = useGardens()
  const { chainId, subgraphs } = getNetwork()

  return (
    <Connect
      location={connectedGarden.address}
      connector={[
        'thegraph',
        {
          orgSubgraphUrl: subgraphs.organizations,
        },
      ]}
      options={{
        network: chainId,
        ipfs: 'https://ipfs.io/ipfs/{cid}{path}',
      }}
    >
      {children}
    </Connect>
  )
}

export { ConnectProvider }
