import BigNumber from '@lib/bigNumber'
import { useMemo } from 'react'
import { PCT_BASE } from '../constants'
import { ConfigType } from '../types/app'

export default function useEffectiveSupply(
  totalSupply: BigNumber,
  config: ConfigType
) {
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
