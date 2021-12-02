import { useEffect, useRef } from 'react'
import { useConnectedGarden } from '@providers/ConnectedGarden'
import { useWallet } from '@providers/Wallet'

// Hook to check if the connected wallet is on a different network than the garden one.
// In case this is true, we´ll try to prompt the user tu switch networks
// and if the user refuses, we´ll disconnect the wallet
export default function useGardenNetworkEnsurance() {
  const {
    chainId: walletChainId,
    connect,
    connected,
    onNetworkSwitch,
    resetConnection,
    switchingNetworks,
  } = useWallet()
  const connectedGarden = useConnectedGarden()
  const gardenChainId = connectedGarden?.chainId

  const switching = useRef(switchingNetworks)

  useEffect(() => {
    switching.current = switchingNetworks
  }, [switchingNetworks])

  useEffect(() => {
    const handleNetworkEnsurance = async () => {
      if (gardenChainId !== walletChainId && connected) {
        try {
          resetConnection()
          await onNetworkSwitch(gardenChainId)
          connect()
        } catch (err) {
          console.error('Error switching networks: ', err)
        }
      }
    }

    if (gardenChainId && !switching.current) {
      handleNetworkEnsurance()
    }
  }, [
    connect,
    connected,
    gardenChainId,
    onNetworkSwitch,
    resetConnection,
    walletChainId,
  ])
}
