import { utils } from 'ethers'
import { useQuery } from 'react-query'

import { getNetwork } from '@/networks'
import { addressToCaip10String, getSelfIdCore } from '@/utils/selfid'

export const useSelfIdProfile = addressOrDID => {
  const core = getSelfIdCore()
  const { chainId } = getNetwork()

  const id =
    addressOrDID && utils.isAddress(addressOrDID)
      ? addressToCaip10String(addressOrDID, chainId)
      : addressOrDID

  return useQuery(
    ['selfIdProfile', id],
    async () => {
      if (!id) return null
      return core.get('basicProfile', id)
    },
    { enabled: Boolean(id) }
  )
}
