import React, { useContext, useEffect, useMemo } from 'react'
import { providers as EthersProviders } from 'ethers'
import { UseWalletProvider, useWallet } from 'use-wallet'
import { getUseWalletConnectors, getDefaultProvider } from '@utils/web3-utils'
import { getNetwork, SUPPORTED_CHAINS } from '@/networks'
import { getDefaultChain } from '@/local-settings'

const WalletAugmentedContext = React.createContext()

function useWalletAugmented() {
  return useContext(WalletAugmentedContext)
}

// Adds Ethers.js to the useWallet() object
function WalletAugmented({ children }) {
  const wallet = useWallet()
  console.log('Chain Id ', wallet)
  const { ethereum } = wallet

  const ethers = useMemo(() => {
    if (!ethereum) {
      return getDefaultProvider()
    }

    const ensRegistry = getNetwork()?.ensRegistry
    return new EthersProviders.Web3Provider(ethereum, {
      name: '',
      chainId: getDefaultChain(),
      ensAddress: ensRegistry,
    })
  }, [ethereum])

  const contextValue = useMemo(() => ({ ...wallet, ethers }), [wallet, ethers])

  useEffect(() => {
    async function connect() {
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
    }
    if (window.ethereum && window.ethereum.isMetaMask) {
      connect()
    }
  }, [])//eslint-disable-line

  return (
    <WalletAugmentedContext.Provider value={contextValue}>
      {children}
    </WalletAugmentedContext.Provider>
  )
}

function WalletProvider({ children }) {
  // const chainId = getDefaultChain()

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
