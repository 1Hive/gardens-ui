import React from 'react'
import { GU, LoadingRing, textStyle } from '@1hive/1hive-ui'
import Description from '../Description'

import { useDescribeVote } from '@hooks/useDescribeVote'
import { ProposalTypes } from '@/types'

function ProposalDescription({ proposal, onSelectProposal }) {
  return (
    <div
      onClick={onSelectProposal}
      css={`
        cursor: pointer;
        margin-bottom: ${3 * GU}px;
        ${textStyle('body1')};
        text-decoration: underline;
        overflow-wrap: anywhere;
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
            max-width: 750px;
            -webkit-box-orient: vertical;
            display: -webkit-box;
          `}
        />
      )}
    </div>
  )
}

export default ProposalDescription
