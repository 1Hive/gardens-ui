import { useMemo } from 'react'
import { Contract as EthersContract, providers as Providers } from 'ethers'
import { getNetwork } from '../networks'

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
    return new EthersContract(address, abi, ethProvider)
  }, [abi, address, ethProvider])
}
