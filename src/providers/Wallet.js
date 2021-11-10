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
import {
  addEthereumChain,
  getEthersNetwork,
  isSupportedChain,
  SUPPORTED_CHAINS,
  switchNetwork,
} from '@/networks'
import { getPreferredChain, setPreferredChain } from '@/local-settings'
import { useWalletConnectors } from '@/ethereum-providers/connectors'

const WalletAugmentedContext = React.createContext()

function useWalletAugmented() {
  return useContext(WalletAugmentedContext)
}

// Adds Ethers.js to the useWallet() object
function WalletAugmented({ children }) {
  const [chainId, setChainId] = useState(-1)
  /* We need  to pass down on the providers tree a preferred network in case that there is no network connnected
  or the connected network is not supported in order to show some data and also to react to the network drop down selector changes */
  const [preferredNetwork, setPreferredNetwork] = useState(getPreferredChain())

  const wallet = useWallet()
  const { account, connector, ethereum, status } = wallet

  const connected = useMemo(() => status === 'connected', [status])

  const ethers = useMemo(() => {
    if (!ethereum) {
      return getDefaultProvider()
    }
    return new EthersProviders.Web3Provider(ethereum, getEthersNetwork())
  }, [ethereum])

  const isSupportedNetwork = useMemo(() => {
    return isSupportedChain(wallet.chainId)
  }, [wallet.chainId])

  const connect = useCallback(async () => {
    if (connector === 'injected') {
      await addEthereumChain()
    }

    if (account) {
      try {
        await wallet.connect(connector)
      } catch (e) {
        console.error(e)
      }
    } else {
      const connectedAddresses = await window?.ethereum?.request({
        method: 'eth_accounts',
      })
      if (connectedAddresses?.length > 0) {
        try {
          await wallet.connect('injected')
        } catch (e) {
          console.error(e)
        }
      }
    }
  }, [account, connector, wallet])

  const resetConnection = useCallback(async () => {
    setChainId(-1)
    await wallet.reset()
  }, [wallet])

  // Handle connect automatically if an account is available and we have some connected address on the wallet
  useEffect(() => connect(), []) // eslint-disable-line

  // This useEffect is needed because we don't have inmediatly available wallet.chainId  right after connecting in the previous hook
  useEffect(() => {
    if (wallet.account != null && chainId !== wallet.chainId) {
      setChainId(wallet.chainId)
      if (SUPPORTED_CHAINS.includes(wallet.chainId)) {
        setPreferredChain(wallet.chainId)
        setPreferredNetwork(wallet.chainId)
      }
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

  const handleOnPreferredNetworkChange = useCallback(
    async index => {
      const chainId = SUPPORTED_CHAINS[index]
      setPreferredNetwork(chainId)
      setPreferredChain(chainId)

      if (connector === 'injected') {
        await switchNetwork(chainId)
      }
    },
    [connector]
  )

  const contextValue = useMemo(
    () => ({
      ...wallet,
      connected,
      handleOnPreferredNetworkChange,
      preferredNetwork,
      isSupportedNetwork,
      resetConnection,
      ethers,
    }),
    [
      connected,
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
  return (
    <UseWalletProvider autoConnect connectors={useWalletConnectors}>
      <WalletAugmented>{children}</WalletAugmented>
    </UseWalletProvider>
  )
}

export { useWalletAugmented as useWallet, WalletProvider }
