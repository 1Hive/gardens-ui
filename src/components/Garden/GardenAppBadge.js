import React from 'react'

import { AppBadge } from '@1hive/1hive-ui'

import { getAppPresentation } from '@utils/app-utils'

import { useConnectedGarden } from '@providers/ConnectedGarden'

import { getNetwork } from '@/networks'

function GardenAppBadge({ app }) {
  const { chainId } = useConnectedGarden()
  const network = getNetwork(chainId)

  if (!app) {
    return null
  }

  const { iconSrc, humanName } = getAppPresentation(app)

  return (
    <AppBadge
      iconSrc={iconSrc}
      label={humanName}
      appAddress={app.address}
      networkType={network.type}
      explorerProvider={network.explorer}
      compact
    />
  )
}

export default GardenAppBadge
