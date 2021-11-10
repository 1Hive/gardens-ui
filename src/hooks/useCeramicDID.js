import { utils } from 'ethers'
import { useQuery } from 'react-query'

import { getNetwork } from '@/networks'
import { addressToCaip10String, getSelfIdCore } from '@/utils/selfid'

export const useCeramicDID = addressOrDID => {
  const core = getSelfIdCore()
  const { chainId } = getNetwork()

  const account =
    addressOrDID && utils.isAddress(addressOrDID)
      ? addressToCaip10String(addressOrDID, chainId)
      : addressOrDID

  return useQuery(['useCeramicDid', account], async () => {
    if (!account) return null
    return core.getAccountDID(account)
  })
}
