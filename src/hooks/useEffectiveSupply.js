import { useMemo } from 'react'
import { PCT_BASE } from '../constants'

export default function useEffectiveSupply(totalSupply, config) {
  return useMemo(() => {
    if (!config) {
      return null
    }

    const { minThresholdStakePercentage, totalStaked } = config.conviction

    const percentageOfTotalSupply = totalSupply
      .multipliedBy(minThresholdStakePercentage)
      .div(PCT_BASE)

    return totalStaked.lt(percentageOfTotalSupply)
      ? percentageOfTotalSupply
      : totalStaked
  }, [config, totalSupply])
}
