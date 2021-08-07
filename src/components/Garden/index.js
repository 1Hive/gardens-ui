import React from 'react'
import Routes from '../../routes/garden/Routes'
import { useGardens } from '@providers/Gardens'

function Garden() {
  const { loading } = useGardens()
  if (loading) {
    return null
  }

  return <Routes />
}

export default Garden
