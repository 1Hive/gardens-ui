import React from 'react'
import { GU, Tag, Timer } from '@1hive/1hive-ui'
import {
  PROPOSAL_STATUS_CHALLENGED_STRING,
  PROPOSAL_STATUS_DISPUTED_STRING,
} from '../../constants'

function ProposalCountdown({ proposal }) {
  if (proposal.hasEnded) {
    return null
  }

  if (proposal.status === PROPOSAL_STATUS_DISPUTED_STRING) {
    return <Tag>Paused</Tag>
  }

  return <CountDown proposal={proposal} />
}

function CountDown({ proposal }) {
  const end =
    proposal.status === PROPOSAL_STATUS_CHALLENGED_STRING
      ? proposal.challengeEndDate
      : proposal.endDate
  return (
    <div
      css={`
        margin-bottom: ${2 * GU}px;
      `}
    >
      <Timer end={end} />
    </div>
  )
}

export default ProposalCountdown
