import React from 'react'
import Routes from '../../routes/garden/Routes'
import { useGardens } from '@providers/Gardens'

function GardenHome() {
  const { loading } = useGardens()
  if (loading) {
    return null
  }

  return <Routes />
}

export default GardenHome
