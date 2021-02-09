import { useMemo } from 'react'
import { Contract as EthersContract, providers as Providers } from 'ethers'
import { getNetwork } from '../networks'
import { useWallet } from '../providers/Wallet'

export function useContractReadOnly(address, abi) {
  const ethEndpoint = getNetwork().defaultEthNode

  const ethProvider = useMemo(
    () => (ethEndpoint ? new Providers.JsonRpcProvider(ethEndpoint) : null),
    [ethEndpoint]
  )

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

export function getContract(address, abi, provider) {
  return new EthersContract(address, abi, provider)
}
