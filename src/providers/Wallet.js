import React, { useContext, useEffect, useMemo } from 'react'
import { providers as EthersProviders } from 'ethers'
import { UseWalletProvider, useWallet } from 'use-wallet'

import { getDefaultProvider } from '@utils/web3-utils'
import { getEthersNetwork } from '@/networks'
import { useWalletConnectors } from '@/ethereum-providers/connectors'

import useConnection from '@/hooks/useConnection'

const WalletAugmentedContext = React.createContext()

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

  return (
    <WalletAugmentedContext.Provider
      value={{
        ...wallet,
        connect,
        connected,
        ethers,
        onNetworkSwitch,
        onPreferredNetworkChange,
        preferredNetwork,
        resetConnection,
        switchingNetworks,
      }}
    >
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

function useWalletAugmented() {
  return useContext(WalletAugmentedContext)
}

export { useWalletAugmented as useWallet, WalletProvider }
