import React from 'react'

import { useConnectedGarden } from '@/providers/ConnectedGarden'

import Routes from '../../routes/garden/Routes'

function Garden() {
  const connectedGarden = useConnectedGarden()
  if (!connectedGarden) {
    return null
  }

  return <Routes />
}

export default Garden
