import { useMemo } from 'react'
import { Contract as EthersContract, providers as Providers } from 'ethers'
import { getNetwork } from '../networks'
import { useWallet } from '../providers/Wallet'

const ethEndpoint = getNetwork().defaultEthNode

const DEFAULT_PROVIDER = new Providers.JsonRpcProvider(ethEndpoint)

export function useContractReadOnly(address, abi) {
  const ethProvider = useMemo(() => (ethEndpoint ? DEFAULT_PROVIDER : null), [])

  return useMemo(() => {
    if (!address) {
      return null
    }
    return getContract(address, abi, ethProvider)
  }, [abi, address, ethProvider])
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

export function getContract(address, abi, provider = DEFAULT_PROVIDER) {
  return new EthersContract(address, abi, provider)
}
