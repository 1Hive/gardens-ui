import React, { useCallback } from 'react'
// import { useHistory } from 'react-router-dom'
import { useRouter } from 'next/router'
import {
  Box,
  Distribution,
  GU,
  shortenAddress,
  Tag,
  useTheme,
  useViewport,
} from '@1hive/1hive-ui'

import { useWallet } from '@providers/Wallet'
import { getNetworkType } from '@/utils/web3-utils'
import { useGardens } from '@/providers/Gardens'
import { getMyStakesPerGarden, refactorInactiveStakes } from './stakes-utils'
import type {
  StakeItem,
  StakeItemProps,
  StakingTokensProps,
} from './stakes-utils'

function StakingTokens({ myStakes, myInactiveStakes }: StakingTokensProps) {
  const { gardensMetadata } = useGardens()
  const theme = useTheme()
  const { below } = useViewport()
  const compact = below('large')

  const myStakesPerGarden = getMyStakesPerGarden(
    myStakes,
    refactorInactiveStakes(myInactiveStakes)
  )(gardensMetadata)
  const colors = [theme.green, theme.red, theme.purple, theme.yellow]

  return (
    <Box heading="Supported proposals" padding={3 * GU}>
      <p>Token distribution per Garden</p>
      {myStakesPerGarden.map(({ garden, gardenName, items }) => (
        <div
          key={garden}
          css={`
            margin-top: 25px;
          `}
        >
          <Distribution
            colors={colors}
            heading={
              <Tag mode="identifier">
                {gardenName ?? shortenAddress(garden)}
              </Tag>
            }
            items={items}
            renderLegendItem={({ item }: { item: StakeItem }) => (
              <StakeItemElement compact={compact} proposal={item} />
            )}
          />
        </div>
      ))}
    </Box>
  )
}

const StakeItemElement = ({ compact, proposal }: StakeItemProps) => {
  const router = useRouter()

  const theme = useTheme()
  const { preferredNetwork } = useWallet()

  const handleSelectProposal = useCallback(
    (gardenId, proposalId) => {
      router.push(
        `/${getNetworkType(
          preferredNetwork
        )}/garden/${gardenId}/proposal/${proposalId}`
      )
    },
    [router, preferredNetwork]
  )

  return (
    <div
      css={`
        background: ${proposal.status === 'ACTIVE' ? theme.badge : '#EEE'};
        border-radius: 3px;
        padding: ${0.5 * GU}px ${1 * GU}px;
        width: ${compact ? '100%' : `${18 * GU}px`};
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;

        ${proposal?.proposalId &&
        proposal.status === 'ACTIVE' &&
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
