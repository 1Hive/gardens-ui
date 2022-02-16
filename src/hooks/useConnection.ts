import { getPreferredChain, setPreferredChain } from '@/local-settings'
import { SUPPORTED_CHAINS, switchNetwork } from '@/networks'
import { useCallback, useEffect, useState } from 'react'
import { useWallet } from 'use-wallet'

function useConnection() {
  const {
    chainId,
    connect: connectWallet,
    connector,
    isConnected,
    reset,
  } = useWallet()

  /* We need  to pass down on the providers tree a preferred network in case that there is no network connnected
  or the connected network is not supported in order to show some data and also to react to the network drop down selector changes */

  const [preferredNetwork, setPreferredNetwork] = useState(getPreferredChain())
  const [switchingNetworks, setSwitchingNetworks] = useState(false)

  const connect = useCallback(
    async (connector) => {
      try {
        await connectWallet(connector)
      } catch (err) {
        console.error(err)

        const connectedAddresses = await window?.ethereum?.request({
          method: 'eth_accounts',
        })
        if (connectedAddresses?.length > 0) {
          try {
            await connectWallet('injected')
          } catch (err) {
            console.error(err)
          }
        }
      }
    },
    [connectWallet]
  )

  const resetConnection = useCallback(async () => {
    await reset()
  }, [reset])

  const handlePreferredNetworkChange = useCallback((chainId) => {
    setPreferredNetwork(chainId)
    setPreferredChain(chainId)
  }, [])

  const handleNetworkSwitch = useCallback(
    async (chainId) => {
      if (connector === 'injected') {
        try {
          setSwitchingNetworks(true)
          await switchNetwork(chainId)
          setSwitchingNetworks(false)
        } catch (err: any) {
          setSwitchingNetworks(false)
          throw new Error(err.message)
        }
      }
    },
    [connector]
  )

  useEffect(() => {
    if (
      isConnected() &&
      chainId !== undefined &&
      preferredNetwork !== chainId
    ) {
      if (SUPPORTED_CHAINS.includes(chainId)) {
        setPreferredChain(chainId)
        setPreferredNetwork(chainId)
      }
    }
  }, [chainId, isConnected]) // eslint-disable-line

  return {
    connect,
    onNetworkSwitch: handleNetworkSwitch,
    onPreferredNetworkChange: handlePreferredNetworkChange,
    preferredNetwork,
    resetConnection,
    switchingNetworks,
  }
}

export default useConnection
