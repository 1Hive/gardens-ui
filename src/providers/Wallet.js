import React, { useContext, useMemo } from 'react'
import { providers as EthersProviders } from 'ethers'
import { UseWalletProvider, useWallet } from 'use-wallet'
import { getUseWalletConnectors } from '../utils/web3-utils'
import { getNetwork } from '../networks'
import { getDefaultChain } from '../local-settings'

const WalletAugmentedContext = React.createContext()

function useWalletAugmented() {
  return useContext(WalletAugmentedContext)
}

// Adds Ethers.js to the useWallet() object
function WalletAugmented({ children }) {
  const wallet = useWallet()
  const { ethereum } = wallet

  const ethers = useMemo(() => {
    if (!ethereum) {
      return new EthersProviders.JsonRpcProvider(getNetwork()?.defaultEthNode)
    }

    const ensRegistry = getNetwork()?.ensRegistry
    return new EthersProviders.Web3Provider(ethereum, {
      name: '',
      chainId: getDefaultChain(),
      ensAddress: ensRegistry,
    })
  }, [ethereum])

  const contextValue = useMemo(() => ({ ...wallet, ethers }), [wallet, ethers])

  return (
    <WalletAugmentedContext.Provider value={contextValue}>
      {children}
    </WalletAugmentedContext.Provider>
  )
}

function WalletProvider({ children }) {
  const chainId = getDefaultChain()

  const connectors = getUseWalletConnectors()
  return (
    <UseWalletProvider chainId={chainId} connectors={connectors}>
      <WalletAugmented>{children}</WalletAugmented>
    </UseWalletProvider>
  )
}

export { useWalletAugmented as useWallet, WalletProvider }
