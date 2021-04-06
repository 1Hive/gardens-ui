import React from 'react'
import { GU, LoadingRing, textStyle } from '@1hive/1hive-ui'
import Description from '../Description'

import { useDescribeVote } from '../../hooks/useDescribeVote'
import { ProposalTypes } from '../../types'

function ProposalDescription({ proposal, onSelectProposal }) {
  return (
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
        proposal.metadata || 'No description'
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
