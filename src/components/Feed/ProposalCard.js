import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { GU, useTheme } from '@1hive/1hive-ui'

import ProposalFooter from './ProposalFooter'
import ProposalHeader from './ProposalHeader'
import ProposalInfo from './ProposalInfo'

import { ProposalTypes } from '../../types'

function ProposalCard({
  proposal,
  onStakeToProposal,
  onVoteOnDecision,
  onWithdrawFromProposal,
}) {
  const theme = useTheme()
  const history = useHistory()

  const handleSelectProposal = useCallback(() => {
    const entityPath =
      proposal.type === ProposalTypes.Decision ? 'vote' : 'proposal'
    history.push(`/${entityPath}/${proposal.number}`)
  }, [history, proposal.number, proposal.type])

  return (
    <div
      css={`
        border: 1px solid ${theme.border};
        background: ${theme.surface};
        margin-bottom: ${2 * GU}px;
        padding: ${3 * GU}px;
        border-radius: ${2 * GU}px;
      `}
    >
      <ProposalHeader
        proposal={proposal}
        onSelectProposal={handleSelectProposal}
      />
      <ProposalInfo
        proposal={proposal}
        onSelectProposal={handleSelectProposal}
      />
      <ProposalFooter
        proposal={proposal}
        onStakeToProposal={onStakeToProposal}
        onVoteOnDecision={onVoteOnDecision}
        onWithdrawFromProposal={onWithdrawFromProposal}
      />
    </div>
  )
}

export default ProposalCard
