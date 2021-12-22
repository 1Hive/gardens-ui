import { useMemo } from 'react'

import { Contract as EthersContract } from 'ethers'

import { getDefaultProvider } from '@utils/web3-utils'

import { useWallet } from '@providers/Wallet'

export function useContractReadOnly(address, abi, chainId) {
  return useMemo(() => {
    if (!address) {
      return null
    }
    return getContract(address, abi, getDefaultProvider(chainId))
  }, [abi, address, chainId])
}

export function useContract(address, abi, signer = true) {
  const { account, ethers } = useWallet()

  return useMemo(() => {
    // Apparently .getSigner() returns a new object every time, so we use the
    // connected account as memo dependency.

    if (!address || !ethers || !account) {
      return null
    }

    return getContract(address, abi, signer ? ethers.getSigner() : ethers)
  }, [abi, account, address, ethers, signer])
}

export function getContract(address, abi, provider = getDefaultProvider()) {
  return new EthersContract(address, abi, provider)
}
