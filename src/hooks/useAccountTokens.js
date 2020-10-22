import { useMemo } from 'react'
import { useAccountStakes } from './useStakes'
import BigNumber from '../lib/bigNumber'

export default function useAccountTokens(account, balance) {
  const myStakes = useAccountStakes(account)

  const activeTokens = useMemo(() => {
    if (!myStakes) {
      return new BigNumber('0')
    }
    return myStakes.reduce((accumulator, stake) => {
      return accumulator.plus(stake.amount)
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
