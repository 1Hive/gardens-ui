import { useMemo } from 'react'
import { Contract as EthersContract } from 'ethers'
import { useWallet } from '@providers/Wallet'
// import { getDefaultProvider } from '@utils/web3-utils'

export function useContractReadOnly(address, abi) {
  return useMemo(() => {
    if (!address) {
      return null
    }
    return getContract(address, abi)
  }, [abi, address])
}

export function useContract(address, abi) {
  const { account, ethers } = useWallet()

  return useMemo(() => {
    // Apparently .getSigner() returns a new object every time, so we use the
    // connected account as memo dependency.

    if (!address || !ethers || !account) {
      return null
    }

    // const sign = signer ? ethers.getSigner() : ethers

    return getContract(address, abi, ethers.getSigner())
  }, [abi, account, address, ethers])
}

export function getContract(address, abi, provider) {
  console.log('ADDRESS !!! ', address)
  console.log('PROVIDER!!! ', provider)
  console.log('CONTRACT ', address)
  return new EthersContract(address, abi, provider)
}
