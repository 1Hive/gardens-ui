import React from 'react'
import { GU, LoadingRing, textStyle, useTheme } from '@1hive/1hive-ui'
import Balance from '../Balance'
import Description from '../Description'

import { useAppState } from '../../providers/AppState'
import { useDescribeVote } from '../../hooks/useDescribeVote'
import { ProposalTypes } from '../../types'
import honeySvg from '../../assets/honey.svg'

function ProposalDescription({ proposal, onSelectProposal }) {
  const theme = useTheme()

  const { requestToken } = useAppState()

  return (
    <div
      css={`
        margin-bottom: ${2 * GU}px;
      `}
    >
      <div
        onClick={onSelectProposal}
        css={`
          cursor: pointer;
          ${textStyle('body1')};
          margin-bottom: ${3 * GU}px;
        `}
      >
        {proposal.type === ProposalTypes.Decision ? (
          <DecisionDescription proposal={proposal} />
        ) : (
          proposal.name
        )}
      </div>
      {proposal.type !== ProposalTypes.Decision && (
        <div
          css={`
            display: flex;
            align-items: center;
            color: ${theme.contentSecondary};
          `}
        >
          <span
            css={`
              margin-right: ${1 * GU}px;
            `}
          >
            Request:
          </span>
          <Balance
            amount={proposal.requestedAmount}
            decimals={requestToken.decimals}
            icon={honeySvg}
            symbol={requestToken.symbol}
          />
        </div>
      )}
    </div>
  )
}

function DecisionDescription({ proposal }) {
  const { description, emptyScript, loading } = useDescribeVote(
    proposal.script,
    proposal.id
  )

  if (loading) {
    return <LoadingRing />
  }

  return (
    <div>
      {emptyScript ? (
        proposal.metadata
      ) : (
        <Description
          path={description}
          css={`
            -webkit-line-clamp: 2;
            overflow: hidden;
            -webkit-box-orient: vertical;
            display: -webkit-box;
          `}
        />
      )}
    </div>
  )
}

export default ProposalDescription
