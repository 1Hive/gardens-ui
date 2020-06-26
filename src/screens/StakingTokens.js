import React, { useMemo } from 'react'
import { Box, Distribution, GU, useTheme, useViewport } from '@1hive/1hive-ui'

import BigNumber from '../lib/bigNumber'
import { stakesPercentages } from '../lib/math-utils'

const DISTRIBUTION_ITEMS_MAX = 6

function displayedStakes(stakes, total) {
  return stakesPercentages(
    stakes.map(({ amount }) => amount),
    {
      total,
      maxIncluded: DISTRIBUTION_ITEMS_MAX,
    }
  ).map((stake, index) => ({
    item: stake.index === -1 ? 'Others' : `${stakes[stake.index].proposalName}`,
    percentage: stake.percentage,
  }))
}

const StakingTokens = React.memo(function StakingTokens({ myStakes }) {
  const theme = useTheme()
  const { below } = useViewport()
  const compact = below('large')

  const myActiveTokens = useMemo(() => {
    if (!myStakes) {
      return new BigNumber('0')
    }

    return myStakes.reduce((accumulator, stake) => {
      return accumulator.plus(stake.amount)
    }, new BigNumber('0'))
  }, [myStakes])

  const stakes = useMemo(() => {
    if (!myStakes) {
      return null
    }
    return displayedStakes(myStakes, myActiveTokens)
  }, [myStakes, myActiveTokens])

  if (myActiveTokens.eq(0)) {
    return null
  }

  return (
    <Box heading="My supported proposals" padding={3 * GU}>
      <div>
        <Distribution
          heading="Your active token distribution"
          items={stakes}
          renderLegendItem={({ item }) => {
            return (
              <div
                css={`
                  background: ${theme.badge};
                  border-radius: 3px;
                  padding: ${0.5 * GU}px ${1 * GU}px;
                  width: ${compact ? '100%' : `${18 * GU}px`};
                  text-overflow: ellipsis;
                  overflow: hidden;
                  white-space: nowrap;
                `}
              >
                {item}
              </div>
            )
          }}
        />
      </div>
    </Box>
  )
})

export default StakingTokens
