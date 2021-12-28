import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { providers as EthersProviders } from 'ethers'
import { UseWalletProvider, useWallet } from 'use-wallet'

import { getDefaultProvider } from '@utils/web3-utils'

import { useWalletConnectors } from '@/ethereum-providers/connectors'
import { getPreferredChain, setPreferredChain } from '@/local-settings'
import {
  SUPPORTED_CHAINS,
  getEthersNetwork,
  isSupportedChain,
  switchNetwork,
} from '@/networks'

const WalletAugmentedContext = React.createContext()

function useWalletAugmented() {
  return useContext(WalletAugmentedContext)
}

// Adds Ethers.js to the useWallet() object
function WalletAugmented({ children }) {
  const wallet = useWallet()
  const { chainId, ethereum, isConnected } = wallet

  const {
    connect,
    onNetworkSwitch,
    onPreferredNetworkChange,
    preferredNetwork,
    resetConnection,
    switchingNetworks,
  } = useConnection()

  const connected = isConnected()

  const ethers = useMemo(() => {
    if (!ethereum) {
      return getDefaultProvider()
    }
    return new EthersProviders.Web3Provider(
      ethereum,
      getEthersNetwork(connected ? chainId : preferredNetwork)
    )
  }, [chainId, connected, ethereum, preferredNetwork])

  const contextValue = useMemo(
    () => ({
      ...wallet,
      connect,
      connected,
      ethers,
      isSupportedNetwork: isSupportedChain(wallet.chainId),
      onNetworkSwitch,
      onPreferredNetworkChange,
      preferredNetwork,
      resetConnection,
      switchingNetworks,
    }),
    [
      connect,
      connected,
      ethers,
      onNetworkSwitch,
      onPreferredNetworkChange,
      preferredNetwork,
      resetConnection,
      switchingNetworks,
      wallet,
    ]
  )

  return (
    <WalletAugmentedContext.Provider value={contextValue}>
      {children}
    </WalletAugmentedContext.Provider>
  )
}

function WalletProvider({ children }) {
  return (
    <UseWalletProvider autoConnect connectors={useWalletConnectors}>
      <WalletAugmented>{children}</WalletAugmented>
    </UseWalletProvider>
  )
}

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

  const handleNetworkSwtich = useCallback(
    async (chainId) => {
      if (connector === 'injected') {
        try {
          setSwitchingNetworks(true)
          await switchNetwork(chainId)
          setSwitchingNetworks(false)
        } catch (err) {
          setSwitchingNetworks(false)
          throw new Error(err.message)
        }
      }
    },
    [connector]
  )

  // This useEffect is needed because we don't have immediately available wallet.chainId right after connecting in the previous hook
  // We just want to trigger this effect on wallet network change, so we´ll remove preferredNetwork from the useEffect dependencies
  useEffect(() => {
    if (isConnected() && preferredNetwork !== chainId) {
      if (SUPPORTED_CHAINS.includes(chainId)) {
        setPreferredChain(chainId)
        setPreferredNetwork(chainId)
      }
    }
  }, [chainId, isConnected]) // eslint-disable-line

  return {
    connect,
    onNetworkSwitch: handleNetworkSwtich,
    onPreferredNetworkChange: handlePreferredNetworkChange,
    preferredNetwork,
    resetConnection,
    switchingNetworks,
  }
}

export { useWalletAugmented as useWallet, WalletProvider }
