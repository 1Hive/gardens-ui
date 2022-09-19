import React from 'react'
import { AppBadge } from '@1hive/1hive-ui'
import { useConnectedGarden } from '@providers/ConnectedGarden'
import { getAppPresentation } from '@utils/app-utils'
import { getNetwork } from '@/networks'
import { AppType } from '@/types/app'

type GardenAppBadgeProps = {
  app: AppType
}

function GardenAppBadge({ app }: GardenAppBadgeProps) {
  const { chainId } = useConnectedGarden()
  const network = getNetwork(chainId)

  if (!app) {
    return null
  }

  const appPresentation = getAppPresentation(app)

  return (
    <AppBadge
      iconSrc={appPresentation?.iconSrc}
      label={appPresentation?.humanName}
      appAddress={app.address}
      networkType={network.type}
      explorerProvider={network.explorer}
      compact
    />
  )
}

export default GardenAppBadge
