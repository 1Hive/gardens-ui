import React from 'react'
import { GU, Timer, Tag } from '@1hive/1hive-ui'
import {
  PROPOSAL_STATUS_CHALLENGED_STRING,
  PROPOSAL_STATUS_DISPUTED_STRING,
} from '@/constants'
import { ProposalType } from '@/types/app'

//TODO: This import will be replaced with @1hive/1hive-ui after new types is updated
// import { HiveUiElements } from './Icons'

type CountDownProps = {
  proposal: ProposalType
}

function ProposalCountdown({ proposal }: CountDownProps) {
  if (proposal.hasEnded) {
    return null
  }

  if (proposal.status === PROPOSAL_STATUS_DISPUTED_STRING) {
    return <Tag>Paused</Tag>
  }

  return <CountDown proposal={proposal} />
}

function CountDown({ proposal }: CountDownProps) {
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
