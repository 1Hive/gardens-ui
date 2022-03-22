import React, { useCallback, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import {
  Box,
  Distribution,
  GU,
  shortenAddress,
  useTheme,
  useViewport,
} from '@1hive/1hive-ui'

import BigNumber from '@lib/bigNumber'
import { useWallet } from '@providers/Wallet'
import { stakesPercentages } from '@utils/math-utils'
import { getNetworkType } from '@/utils/web3-utils'
import { useGardens } from '@/providers/Gardens'

const DISTRIBUTION_ITEMS_MAX = 6

type StakeItem = {
  amount?: any
  gardenId: string | null
  proposalId: string | null
  proposalName: string
}

type TransformedStakeType = {
  item: StakeItem
  percentage: any
} | null

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

const getStakeItemsPerGarden = (
  stakes: Array<TransformedStakeType> | null,
  garden: string
) => {
  const items: Array<any> = []

  stakes?.map((stake) => {
    if (stake?.item.gardenId === garden) {
      items.push({
        item: stake?.item,
        percentage: Math.round(stake?.percentage) ?? '0',
      })
    }
  })

  return items
}

type Garden = { address: string; name: string }

const getGardenNameByGardens = (
  gardens: Array<Garden>,
  gardenAddress: string
) => {
  const garden = gardens.find(
    (garden: Garden) => garden.address.toLowerCase() === gardenAddress
  )

  return garden?.name ?? ''
}

const getStakesByGarden = (
  gardensMetadata: Array<Garden>,
  stakes: Array<TransformedStakeType> | null
): Array<{
  garden: string
  gardenName: string
  items: Array<TransformedStakeType>
}> => {
  if (stakes === null) return []

  const gardens: Array<any> = []
  const stakesPerGarden: Array<any> = []

  // get all unique gardens
  stakes.map((stake: TransformedStakeType) => {
    const gardenId = stake?.item?.gardenId
    if (!gardens.includes(gardenId) && gardenId !== null) {
      gardens.push(gardenId)
    }
  })

  gardens.map((garden) => {
    stakesPerGarden.push({
      garden,
      gardenName: getGardenNameByGardens(gardensMetadata, garden),
      items: getStakeItemsPerGarden(stakes, garden),
    })
  })

  return stakesPerGarden
}

function StakingTokens({ myStakes }: StakingTokensProps) {
  const { gardensMetadata } = useGardens()
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

  const colors = [theme.green, theme.red, theme.purple, theme.yellow]
  const stakesByGarden = getStakesByGarden(gardensMetadata, stakes)

  return (
    <Box heading="Supported proposals" padding={3 * GU}>
      <p>Active token distribution</p>
      {stakesByGarden.map(({ garden, gardenName, items }) => (
        <div
          key={garden}
          css={`
            margin-top: 25px;
          `}
        >
          <Distribution
            colors={colors}
            heading={
              <p
                css={`
                  margin-bottom: 10px;
                  font-size: 16px;
                `}
              >
                {gardenName ?? shortenAddress(garden)}
              </p>
            }
            items={items}
            renderLegendItem={({ item }: { item: StakeItem }) => (
              <StakeItem compact={compact} proposal={item} />
            )}
          />
        </div>
      ))}
    </Box>
  )
}

type StakeItemProps = {
  compact: any
  proposal: StakeItem
}

const StakeItem = ({ compact, proposal }: StakeItemProps) => {
  const history = useHistory()

  const theme = useTheme()
  const { preferredNetwork } = useWallet()

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

        ${proposal?.proposalId &&
        `cursor: pointer; &:hover {
            background: ${theme.badge.alpha(0.7)}
          }
        `}
      `}
      onClick={() =>
        proposal?.proposalId &&
        handleSelectProposal(proposal?.gardenId, proposal?.proposalId)
      }
    >
      {proposal?.proposalName}
    </div>
  )
}

export default React.memo(StakingTokens)
