import React from 'react'
import { Connect } from '@1hive/connect-react'

import { useConnectedGarden } from './ConnectedGarden'
import useGardenNetworkEnsurance from '@hooks/useGardenNetworkEnsurance'

import { getNetwork } from '../networks'

function ConnectProvider({ children }) {
  useGardenNetworkEnsurance()
  const connectedGarden = useConnectedGarden()
  const { subgraphs } = getNetwork(connectedGarden.chainId)

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
        network: connectedGarden.chainId,
        ipfs: 'https://ipfs.io/ipfs/{cid}{path}',
      }}
    >
      {children}
    </Connect>
  )
}

export { ConnectProvider }
