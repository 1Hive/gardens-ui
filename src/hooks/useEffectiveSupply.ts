import { useMemo } from 'react'

import BigNumber from '@lib/bigNumber'

import { PCT_BASE } from '../constants'
import { ConfigType } from './constants'

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
