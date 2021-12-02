import { useMemo } from 'react'
import { useAccountStakesByGarden } from './useStakes'

import BigNumber from '@lib/bigNumber'

export default function useAccountTotalStaked(account) {
  const stakes = useAccountStakesByGarden(account)

  return useMemo(
    () =>
      stakes.reduce((acc, { amount }) => {
        return acc.plus(amount)
      }, new BigNumber(0)),
    [stakes]
  )
}
