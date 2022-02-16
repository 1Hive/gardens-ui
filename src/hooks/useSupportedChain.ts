import { useState, useEffect } from 'react'
import { isSupportedConnectedChain } from '@/networks'

const useSupportedChain = () => {
  const [isSupportedNetwork, setIsSupportedNetwork] = useState(
    isSupportedConnectedChain()
  )

  const networkChanged = () => {
    setIsSupportedNetwork(isSupportedConnectedChain())
  }

  useEffect(() => {
    window.ethereum.on('chainChanged', networkChanged)

    return () => {
      window.ethereum.removeListener('chainChanged', networkChanged)
    }
  }, [])

  return isSupportedNetwork
}

export default useSupportedChain
