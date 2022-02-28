import React, { useCallback, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { Box, Distribution, GU, useTheme, useViewport } from '@1hive/1hive-ui'

import BigNumber from '@lib/bigNumber'
import { useWallet } from '@providers/Wallet'
import { stakesPercentages } from '@utils/math-utils'
import { getNetworkType } from '@/utils/web3-utils'

const DISTRIBUTION_ITEMS_MAX = 6

type StakeItem = {
  amount?: any
  gardenId: any
  proposalId: any
  proposalName: any
}

type TransformedStakeType = {
  item: {
    gardenId: any
    proposalId: any
    proposalName: any
  }
  percentage: any
}

type StakingTokensProps = {
  myStakes: Array<StakeItem>
}

function displayedStakes(stakes: Array<StakeItem>, total: BigNumber) {
  return stakesPercentages(
    stakes.map(({ amount }) => amount),
    {
      total,
      maxIncluded: DISTRIBUTION_ITEMS_MAX,
    }
  ).map((stake: any) => ({
    item: {
      gardenId: stake.index === -1 ? null : stakes[stake.index].gardenId,
      proposalId: stake.index === -1 ? null : stakes[stake.index].proposalId,
      proposalName:
        stake.index === -1 ? 'Others' : stakes[stake.index].proposalName,
    },
    percentage: stake.percentage,
  }))
}

const useStakesByGarden = (
  stakes: Array<TransformedStakeType> | null
): Array<{
  garden: string
  items: Array<TransformedStakeType>
}> => {
  if (stakes === null) return []

  const gardens: Array<any> = []

  // get all unique gardens
  stakes.map((stake) => {
    if (!gardens.includes(stake.item.gardenId)) {
      gardens.push(stake.item.gardenId)
    }
  })

  return gardens.reduce(
    (acc, garden) => [
      ...acc,
      {
        garden,
        items: stakes.map((stake) => {
          if (stake.item.gardenId === garden) {
            return {
              item: stake.item,
              percentage: Math.round(stake.percentage),
            }
          }
        }),
      },
    ],
    []
  )
}

function StakingTokens({ myStakes }: StakingTokensProps) {
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

  return (
    <>
      {stakesByGarden.map(({ garden, items }) => (
        <Box heading="Supported proposals" padding={3 * GU} key={garden}>
          <label>{garden}</label>
          <div>
            <Distribution
              colors={colors}
              heading="Active token distribution"
              items={items}
              renderLegendItem={({ item }: { item: StakeItem }) => {
                const { proposalName, proposalId } = item
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
                    onClick={() =>
                      proposalId && handleSelectProposal(garden, proposalId)
                    }
                  >
                    {proposalName}
                  </div>
                )
              }}
            />
          </div>
        </Box>
      ))}
    </>
  )
}

export default React.memo(StakingTokens)
