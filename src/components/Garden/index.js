import React from 'react'
import Routes from '../../routes/garden/Routes'
import { useConnectedGarden } from '@/providers/ConnectedGarden'

function Garden() {
  const connectedGarden = useConnectedGarden()
  if (!connectedGarden) {
    return null
  }

  return <Routes />
}

export default Garden
