import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { providers as EthersProviders } from 'ethers'
import { UseWalletProvider, useWallet } from '@1hive/use-wallet'
// import UnsupportedChainModal from '../components/UnsupportedChainModal'

import { getUseWalletConnectors, getDefaultProvider } from '@utils/web3-utils'
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
  const [chainId, setChainId] = useState(-1)
  /* We need  to pass down on the providers tree a preferred network in case that there is no network connnected
  or the connected network is not supported in order to show some data and also to react to the network drop down selector changes */
  const [preferredNetwork, setPreferredNetwork] = useState(getPreferredChain())

  const wallet = useWallet()
  const { ethereum } = wallet

  console.log('chainId ', chainId)

  console.log('wallet ', wallet)

  const ethers = useMemo(() => {
    if (!ethereum) {
      return getDefaultProvider()
    }

    const ensRegistry = getNetwork(wallet.chainId)?.ensRegistry
    return new EthersProviders.Web3Provider(ethereum, {
      name: '',
      chainId: getPreferredChain(),
      ensAddress: ensRegistry,
    })
  }, [ethereum, wallet.chainId]) //eslint-disable-line

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
    setChainId(-1)
    await wallet.reset()
  }, [wallet])

  // Handle connect automatically if windows.ethereum is available and we have some connected address on the wallet
  useEffect(() => {
    if (window.ethereum) {
      connect()
    }
  }, []) //eslint-disable-line

  // This useEffect is needed because we don't have inmediatly available wallet.chainId  right after connecting in the previous hook
  useEffect(() => {
    if (wallet.account != null && chainId !== wallet.chainId) {
      setChainId(wallet.chainId)
      setPreferredChain(wallet.chainId)
    }
  }, [wallet.account, wallet.chainId, chainId])

  /* Note that with this hook and the previous one we are manually reseting the connection on chain changed detected.
  Here i noticed that is better to always depend on the data that comes from the use-wallet library instead  of just subscribing to window.ethereum.on('chainChanged', handleChainChanged) 
  because for some reason the reconnect action is way faster and the windows event subscription was triggering many re renders */
  useEffect(() => {
    async function reset() {
      await resetConnection()
      await connect()
    }
    if (chainId !== -1 && wallet._web3ReactContext.chainId !== chainId) {
      reset()
    }
  }, [
    wallet._web3ReactContext.chainId,
    chainId,
    connect,
    resetConnection,
    wallet,
  ])

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
