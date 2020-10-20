import React from 'react'
import { GU, Timer } from '@1hive/1hive-ui'

function ProposalCountdown({ proposal }) {
  if (proposal.data.closed) {
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
