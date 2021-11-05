import React, { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { providers as EthersProviders } from 'ethers'
import {
  chains,
  ChainUnsupportedError,
  UseWalletProvider,
  useWallet as useWalletBase,
} from 'use-wallet'

import { getDefaultProvider } from '@utils/web3-utils'
import { getEthersNetwork } from '@/networks'
import { getDefaultChain } from '@/local-settings'
import { useWalletConnectors } from '@/ethereum-providers/connectors'
import { LocalStorageWrapper } from '@/local-storage-wrapper'

export const WALLET_STATUS = Object.freeze({
  providers: 'providers',
  network: 'network',
  connecting: 'connecting',
  connected: 'connected',
  disconnected: 'disconnected',
  error: 'error',
})

const NETWORK_TYPE_DEFAULT = chains.getChainInformation(getDefaultChain())?.type

const WalletAugmentedContext = React.createContext()

// Adds Ethers.js to the useWallet() object
function WalletAugmented({ children }) {
  const {
    account,
    balance,
    ethereum,
    connector,
    status,
    chainId,
    providerInfo,
    type,
    networkName,
    ...walletBaseRest
  } = useWalletBase()

  const initialNetwork = useMemo(() => {
    const lastNetwork = LocalStorageWrapper.get('last-network', false)
    if (!lastNetwork) return NETWORK_TYPE_DEFAULT
    return lastNetwork
  }, [])

  const [disconnectedNetworkType, setDisconnectedNetworkType] = useState(
    initialNetwork
  )

  const connected = useMemo(() => status === 'connected', [status])
  const networkType = useMemo(() => {
    const newNetwork = connected ? networkName : disconnectedNetworkType
    LocalStorageWrapper.set('last-network', newNetwork, false)
    return newNetwork
  }, [connected, networkName, disconnectedNetworkType])

  const changeNetworkTypeDisconnected = useCallback(
    newNetworkType => {
      if (status === 'disconnected') {
        setDisconnectedNetworkType(newNetworkType)
      }
    },
    [status]
  )

  const ethers = useMemo(() => {
    if (!ethereum) {
      return getDefaultProvider()
    }

    return new EthersProviders.Web3Provider(ethereum, getEthersNetwork())
  }, [ethereum])

  const wallet = useMemo(
    () => ({
      account,
      balance,
      ethereum,
      ethers,
      networkType,
      providerInfo: providerInfo,
      status,
      chainId: connected ? chainId : getDefaultChain(), // connect to default chain if wallet is not connected
      connected,
      changeNetworkTypeDisconnected,
      ...walletBaseRest,
    }),
    [
      account,
      balance,
      ethereum,
      ethers,
      networkType,
      providerInfo,
      status,
      chainId,
      walletBaseRest,
      connected,
      changeNetworkTypeDisconnected,
    ]
  )

  return (
    <WalletAugmentedContext.Provider value={wallet}>
      {children}
    </WalletAugmentedContext.Provider>
  )
}
WalletAugmentedContext.propTypes = { children: PropTypes.node }

export function WalletProvider({ children }) {
  return (
    <UseWalletProvider connectors={useWalletConnectors} autoConnect>
      <WalletAugmented>{children}</WalletAugmented>
    </UseWalletProvider>
  )
}
WalletProvider.propTypes = { children: PropTypes.node }

export function useWallet() {
  return useContext(WalletAugmentedContext)
}

export { ChainUnsupportedError }
