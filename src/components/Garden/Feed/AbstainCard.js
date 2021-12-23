import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'

import { GU, useTheme, useViewport } from '@1hive/1hive-ui'

import { buildGardenPath } from '@utils/routing-utils'

import ProposalFooter from './ProposalFooter'
import ProposalInfo from './ProposalInfo'

function AbstainCard({ proposal }) {
  const theme = useTheme()
  const history = useHistory()

  const { below } = useViewport()

  const handleSelectProposal = useCallback(() => {
    const path = buildGardenPath(
      history.location,
      `proposal/${proposal.number}`
    )
    history.push(path)
  }, [history, proposal.number])

  return (
    <div
      css={`
        border: 1px solid ${theme.border};
        background: ${theme.surface};
        margin-bottom: ${2 * GU}px;
        padding: ${3 * GU}px;
        border-radius: ${2 * GU}px;

        ${below('medium') &&
        `
          padding-left: ${2 * GU}px;
          padding-right: ${2 * GU}px;
          border-left: 0;
          border-right: 0;
          border-radius: 0;
        `}
      `}
    >
      <ProposalInfo
        proposal={proposal}
        onSelectProposal={handleSelectProposal}
      />
      <ProposalFooter proposal={proposal} />
    </div>
  )
}

export default AbstainCard
