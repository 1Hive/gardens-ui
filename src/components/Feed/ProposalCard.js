import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { GU, useTheme } from '@1hive/1hive-ui'

import ProposalDescription from './ProposalDescription'
import ProposalFooter from './ProposalFooter'
import ProposalHeader from './ProposalHeader'
import ProposalSupport from './ProposalSupport'

import { ProposalTypes } from '../../types'

function ProposalCard({ proposal, onStakeToProposal, onWithdrawFromProposal }) {
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
      <ProposalDescription
        proposal={proposal}
        onSelectProposal={handleSelectProposal}
      />
      <ProposalSupport proposal={proposal} />
      <ProposalFooter
        proposal={proposal}
        onStakeToProposal={onStakeToProposal}
        onWithdrawFromProposal={onWithdrawFromProposal}
      />
    </div>
  )
}

export default ProposalCard
