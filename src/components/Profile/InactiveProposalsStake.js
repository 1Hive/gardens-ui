import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { Box, GU, textStyle, useTheme, useViewport } from '@1hive/1hive-ui'
import { useGardenState } from '@providers/GardenState'

import { formatTokenAmount } from '@utils/token-utils'

function InactiveProposalsStake({ myInactiveStakes }) {
  const { below } = useViewport()
  const compact = below('large')
  const history = useHistory()
  const { config } = useGardenState()
  const { stakeToken } = config.conviction

  const handleSelectProposal = useCallback(
    (gardenId, proposalId) => {
      history.push(`garden/${gardenId}/proposal/${proposalId}`)
    },
    [history]
  )
  return (
    <Box heading="Inactive proposals stake" padding={3 * GU}>
      {myInactiveStakes.map(stake => {
        return (
          <ProposalItem
            amount={stake.amount}
            compact={compact}
            gardenId={stake.proposal.organization.id}
            proposalId={stake.proposal.id}
            proposalName={stake.proposal.metadata}
            selectProposal={handleSelectProposal}
            stakeToken={stakeToken}
          />
        )
      })}
    </Box>
  )
}

const ProposalItem = ({
  amount,
  compact,
  gardenId,
  proposalId,
  proposalName,
  selectProposal,
  stakeToken,
}) => {
  const theme = useTheme()

  const handleOnClick = useCallback(() => {
    selectProposal(gardenId, proposalId)
  }, [gardenId, proposalId, selectProposal])

  return (
    <div
      css={`
        display: flex;
        align-items: center;
        margin-bottom: ${1 * GU}px;
      `}
    >
      <div
        css={`
          width: ${1 * GU}px;
          height: ${1 * GU}px;
          border-radius: 50%;
          background: ${theme.disabled};
          margin-right: ${1 * GU}px;
          flex-shrink: 0;
        `}
      />
      <div
        css={`
          display: flex;
          width: 100%;
          justify-content: space-between;
          align-items: center;
          ${textStyle('body2')};
        `}
      >
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
        <span
          css={`
            margin-left: ${1 * GU}px;
          `}
        >
          {formatTokenAmount(amount, stakeToken.decimals)}
        </span>
      </div>
    </div>
  )
}

export default InactiveProposalsStake
