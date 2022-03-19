import { useMemo } from 'react'
import { useAccountStakesByGarden } from './useStakes'
import BigNumber from '@lib/bigNumber'

export default function useAccountTokens(account: string, balance: BigNumber) {
  const myStakes = useAccountStakesByGarden(account)

  const activeTokens = useMemo(() => {
    if (!myStakes) {
      return new BigNumber('0')
    }
    return myStakes.reduce((acc: BigNumber, stake: { amount: number }) => {
      return acc.plus(stake.amount)
    }, new BigNumber('0'))
  }, [myStakes])

  const inactiveTokens = useMemo(() => {
    if (!balance.gte(0) || !activeTokens) {
      return new BigNumber('0')
    }
    return balance.minus(activeTokens)
  }, [activeTokens, balance])

  return { activeTokens, inactiveTokens }
}
