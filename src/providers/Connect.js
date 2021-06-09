import React from 'react'
import { Connect } from '@1hive/connect-react'

import { useGardens } from './Gardens'
import { getNetwork } from '../networks'

function ConnectProvider({ children }) {
  const { connectedGarden } = useGardens()
  // TODO - just for testing we need to publish all  our own connect libraries modifying
  // here the endpoints https://github.com/1Hive/connect/blob/ce297ac6cb5c51daad7beac27c58b0fd1c013fd6/packages/connect-thegraph/src/connector.ts#L39
  // Or have the orgSubgraphUrl on the network file
  return (
    <Connect
      location={connectedGarden.address}
      connector={[
        'thegraph',
        {
          orgSubgraphUrl:
            'https://api.thegraph.com/subgraphs/name/1hive/aragon-rinkeby',
        },
      ]}
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
