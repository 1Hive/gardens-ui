import { useMemo } from 'react'

import BigNumber from '@lib/bigNumber'

import { useAccountStakesByGarden } from './useStakes'

export default function useAccountTotalStaked(account: string) {
  const stakes = useAccountStakesByGarden(account)

  return useMemo(
    () =>
      stakes.reduce((acc: BigNumber, stake: { amount: number }) => {
        return acc.plus(stake.amount)
      }, new BigNumber(0)),
    [stakes]
  )
}
