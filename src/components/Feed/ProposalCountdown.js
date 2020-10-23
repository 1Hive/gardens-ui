import React from 'react'
import { GU, Timer } from '@1hive/1hive-ui'
import { getVoteSuccess } from '../../utils/vote-utils'
import { PCT_BASE } from '../../constants'

function ProposalCountdown({ proposal }) {
  const { closed, delayed } = proposal.data

  if (
    (closed && !delayed) ||
    (delayed && !getVoteSuccess(proposal, PCT_BASE))
  ) {
    return null
  }

  return (
    <div
      css={`
        margin-bottom: ${2 * GU}px;
      `}
    >
      <Timer end={proposal.data.transitionAt} />
    </div>
  )
}

export default ProposalCountdown
