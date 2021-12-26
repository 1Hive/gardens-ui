import { useMemo } from 'react'

import { ContractInterface, Contract as EthersContract } from 'ethers'

import { useWallet } from '@providers/Wallet'

import { getDefaultProvider } from '@utils/web3-utils'

export function useContractReadOnly(
  address: string,
  abi: ContractInterface,
  chainId: number
): EthersContract | null {
  return useMemo(() => {
    if (!address) {
      return null
    }
    return getContract(address, abi, getDefaultProvider(chainId))
  }, [abi, address, chainId])
}

export function useContract(
  address: string,
  abi: ContractInterface,
  signer = true
) {
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

export function getContract(
  address: string,
  abi: ContractInterface,
  provider = getDefaultProvider()
) {
  return new EthersContract(address, abi, provider)
}
