import React from 'react'
import { Connect } from '@1hive/connect-react'
import { getNetwork } from '../networks'

function ConnectProvider({ orgAddress, children }) {
  return (
    <Connect
      location={orgAddress}
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
