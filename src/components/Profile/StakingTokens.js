import React, { useCallback, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { Box, Distribution, GU, useTheme, useViewport } from '@1hive/1hive-ui'

import BigNumber from '@lib/bigNumber'
import { useWallet } from '@providers/Wallet'
import { stakesPercentages } from '@utils/math-utils'
import { getNetworkType } from '@/utils/web3-utils'

const DISTRIBUTION_ITEMS_MAX = 6

function displayedStakes(stakes, total) {
  return stakesPercentages(
    stakes.map(({ amount }) => amount),
    {
      total,
      maxIncluded: DISTRIBUTION_ITEMS_MAX,
    }
  ).map((stake) => ({
    item: {
      gardenId: stake.index === -1 ? null : stakes[stake.index].gardenId,
      proposalId: stake.index === -1 ? null : stakes[stake.index].proposalId,
      proposalName:
        stake.index === -1 ? 'Others' : stakes[stake.index].proposalName,
    },
    percentage: stake.percentage,
  }))
}

function useStakesByGarden(stakes) {
  let gardens = []

  // get all unique gardens
  stakes.map((c) => {
    if (!gardens.includes(c.item.gardenId)) {
      gardens.push(c.item.gardenId)
    }
  })

  return gardens.reduce(
    (acc, garden) => [
      ...acc,
      {
        garden,
        items: stakes.map((stakeItem) => {
          if (stakeItem.item.gardenId === garden) {
            return {
              item: stakeItem.item,
              percentage: Math.round(stakeItem.percentage),
            }
          }
        }),
      },
    ],
    []
  )
}

const StakingTokens = React.memo(function StakingTokens({ myStakes }) {
  const theme = useTheme()
  const { below } = useViewport()
  const { preferredNetwork } = useWallet()
  const compact = below('large')

  const history = useHistory()
  const handleSelectProposal = useCallback(
    (gardenId, proposalId) => {
      history.push(
        `/${getNetworkType(
          preferredNetwork
        )}/garden/${gardenId}/proposal/${proposalId}`
      )
    },
    [history, preferredNetwork]
  )

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

  const colors = [theme.green, theme.red, theme.purple, theme.yellow]
  const stakesByGarden = useStakesByGarden(stakes)

  console.log(`stakesByGarden`, stakesByGarden)

  return (
    <>
      {stakesByGarden.map(({ garden, items }) => (
        <Box heading="Supported proposals" padding={3 * GU}>
          <label>{garden}</label>
          <div>
            <Distribution
              colors={colors}
              heading="Active token distribution"
              items={items}
              renderLegendItem={({ item }) => {
                const { proposalName, proposalId } = item
                return (
                  <DistributionItem
                    compact={compact}
                    gardenId={garden}
                    proposalName={proposalName}
                    proposalId={proposalId}
                    selectProposal={handleSelectProposal}
                  />
                )
              }}
            />
          </div>
        </Box>
      ))}
    </>
  )
})

const DistributionItem = ({
  compact,
  gardenId,
  proposalId,
  proposalName,
  selectProposal,
}) => {
  const theme = useTheme()

  const handleOnClick = useCallback(() => {
    selectProposal(gardenId, proposalId)
  }, [gardenId, proposalId, selectProposal])

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

        ${proposalId &&
        `cursor: pointer; &:hover {
          background: ${theme.badge.alpha(0.7)}
        }`}
      `}
      onClick={proposalId ? handleOnClick : null}
    >
      {proposalName}
    </div>
  )
}

export default StakingTokens
