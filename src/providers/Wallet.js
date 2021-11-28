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
  const wallet = useWallet()
  const { ethereum, isConnected } = wallet

  const ethers = useMemo(() => {
    if (!ethereum) {
      return getDefaultProvider()
    }
    return new EthersProviders.Web3Provider(ethereum, getEthersNetwork())
  }, [ethereum])

  const {
    onPreferredNetworkChange,
    preferredNetwork,
    resetConnection,
  } = useConnection()

  const contextValue = useMemo(
    () => ({
      ...wallet,
      connected: isConnected(),
      onPreferredNetworkChange,
      preferredNetwork,
      isSupportedNetwork: isSupportedChain(wallet.chainId),
      resetConnection,
      ethers,
    }),
    [
      ethers,
      isConnected,
      onPreferredNetworkChange,
      preferredNetwork,
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

function useConnection() {
  const wallet = useWallet()
  const { account, connector } = wallet
  /* We need  to pass down on the providers tree a preferred network in case that there is no network connnected
  or the connected network is not supported in order to show some data and also to react to the network drop down selector changes */
  const [preferredNetwork, setPreferredNetwork] = useState(getPreferredChain())

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
    await wallet.reset()
  }, [wallet])

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

  // Handle connect automatically if an account is available and we have some connected address on the wallet
  useEffect(() => connect(), []) // eslint-disable-line

  // This useEffect is needed because we don't have immediately available wallet.chainId right after connecting in the previous hook
  // We just want to trigger this effect on wallet network change, so we´ll remove preferredNetwork from the useEffect dependencies
  useEffect(() => {
    if (wallet.account && preferredNetwork !== wallet.chainId) {
      if (SUPPORTED_CHAINS.includes(wallet.chainId)) {
        setPreferredChain(wallet.chainId)
        setPreferredNetwork(wallet.chainId)
      }
    }
  }, [wallet.account, wallet.chainId]) // eslint-disable-line 

  return {
    onPreferredNetworkChange: handleOnPreferredNetworkChange,
    preferredNetwork,
    resetConnection,
  }
}

export { useWalletAugmented as useWallet, WalletProvider }
