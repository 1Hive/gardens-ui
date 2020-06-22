import React from 'react'
import { IdentityBadge as Badge } from '@aragon/ui'
import { getNetworkType } from '../lib/web3-utils'

function IdentityBadge({ entity, ...props }) {
  return <Badge entity={entity} networkType={getNetworkType()} {...props} />
}

IdentityBadge.propTypes = {
  ...Badge.propTypes,
}

export default IdentityBadge
