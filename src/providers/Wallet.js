import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { providers as EthersProviders } from 'ethers'
import { UseWalletProvider, useWallet } from '@1hive/use-wallet'

import { getUseWalletConnectors, getPreferredProvider } from '@utils/web3-utils'
import { getNetwork, isSupportedChain, SUPPORTED_CHAINS } from '@/networks'
import { getPreferredChain, setPreferredChain } from '@/local-settings'

const WalletAugmentedContext = React.createContext()

function useWalletAugmented() {
  return useContext(WalletAugmentedContext)
}

// Adds Ethers.js to the useWallet() object
function WalletAugmented({ children }) {
  // This new state is neede to avoid showing the user the profile signature request on every network change
  const [chainReseted, setChainReseted] = useState(false)
  /* We need  to pass down on the providers tree a preferred network in case that there is no network connnected
  or the connected network is not supported in order to show some data and also to react to the network drop down selector changes */
  const [preferredNetwork, setPreferredNetwork] = useState(getPreferredChain())

  const wallet = useWallet()
  const { ethereum } = wallet

  const ethers = useMemo(() => {
    if (!ethereum) {
      return getPreferredProvider()
    }

    const ensRegistry = getNetwork(preferredNetwork)?.ensRegistry
    return new EthersProviders.Web3Provider(ethereum, {
      name: '',
      chainId: preferredNetwork,
      ensAddress: ensRegistry,
    })
  }, [ethereum, preferredNetwork]) //eslint-disable-line

  const isSupportedNetwork = useMemo(() => {
    return isSupportedChain(wallet.chainId)
  }, [wallet.chainId])

  const connect = useCallback(async () => {
    const connectedAddresses = await window.ethereum.request({
      method: 'eth_accounts',
    })
    if (connectedAddresses.length > 0) {
      try {
        await wallet.connect('injected')
      } catch (e) {
        console.error(e)
      }
    }
  }, [wallet])

  const resetConnection = useCallback(async () => {
    setChainReseted(true)
    await wallet.reset()
  }, [wallet])

  // Handle connect automatically if windows.ethereum is available and we have some connected address on the wallet
  useEffect(() => {
    async function connectNetwork() {
      await connect()
    }
    if (window.ethereum && wallet.chainId === -1) {
      connectNetwork()
    }
    if (isSupportedNetwork) {
      setPreferredNetwork(wallet.chainId)
    }
  }, []) //eslint-disable-line

  useEffect(() => {
    async function connectNetwork() {
      await resetConnection()
      await connect()
    }

    if (
      wallet.chainId !== wallet._web3ReactContext.chainId &&
      wallet.status !== 'connecting'
    ) {
      if (isSupportedChain(wallet._web3ReactContext.chainId)) {
        connectNetwork()
      } else if (wallet.chainId !== -1) {
        resetConnection()
      }
    }
    if (isSupportedChain(wallet._web3ReactContext.chainId)) {
      setPreferredNetwork(wallet._web3ReactContext.chainId)
    }
  }, [isSupportedChain, wallet, resetConnection])//eslint-disable-line


  useEffect(() => {
    if (isSupportedChain(wallet.chainId)) {
      setPreferredChain(wallet.chainId)
    }
  }, [wallet.chainId])

  const handleOnPreferredNetworkChange = useCallback(index => {
    const chainId = SUPPORTED_CHAINS[index]
    setPreferredNetwork(chainId)
    setPreferredChain(chainId)
  }, [])

  const contextValue = useMemo(
    () => ({
      ...wallet,
      handleOnPreferredNetworkChange,
      preferredNetwork,
      isSupportedNetwork,
      resetConnection,
      chainReseted,
      ethers,
    }),
    [
      chainReseted,
      ethers,
      handleOnPreferredNetworkChange,
      preferredNetwork,
      isSupportedNetwork,
      resetConnection,
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
  const connectors = getUseWalletConnectors()
  return (
    <UseWalletProvider
      supportedChains={SUPPORTED_CHAINS}
      connectors={connectors}
    >
      <WalletAugmented>{children}</WalletAugmented>
    </UseWalletProvider>
  )
}

export { useWalletAugmented as useWallet, WalletProvider }
