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
    if (window.ethereum) {
      window.ethereum.on('chainChanged', networkChanged)
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', networkChanged)
      }
    }
  }, [])

  return isSupportedNetwork
}

export default useSupportedChain
