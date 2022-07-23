import React from 'react'
import { GU, LoadingRing, textStyle } from '@1hive/1hive-ui'
import Description from '../Description'

import { useDescribeVote } from '@hooks/useDescribeVote'
import { ProposalTypes } from '@/types'
import { ProposalType } from '@/types/app'

type ProposalDescriptionProps = {
  proposal: ProposalType
}

function ProposalDescription({ proposal }: ProposalDescriptionProps) {
  return (
    <div
      css={`
        cursor: pointer;
        margin-bottom: ${proposal.type === ProposalTypes.Poll ? 0 : 3 * GU}px;
        ${textStyle('body1')};
        text-decoration: underline;
        overflow-wrap: anywhere;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
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

type DecisionDescriptionProps = {
  proposal: ProposalType
}

function DecisionDescription({ proposal }: DecisionDescriptionProps) {
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
          dotIndicator={false}
          css={`
            -webkit-line-clamp: 1;
            overflow: hidden;
            max-width: 750px;
            -webkit-box-orient: vertical;
            display: -webkit-box;
          `}
          disableBadgeInteraction={false}
        />
      )}
    </div>
  )
}

export default ProposalDescription
