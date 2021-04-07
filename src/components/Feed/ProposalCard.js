import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { GU, useTheme, useViewport } from '@1hive/1hive-ui'

import ProposalFooter from './ProposalFooter'
import ProposalHeader from './ProposalHeader'
import ProposalInfo from './ProposalInfo'
import { useProposalWithThreshold } from '../../hooks/useProposals'

import { ProposalTypes } from '../../types'

function ProposalCard({ proposal, ...props }) {
  return proposal.type === ProposalTypes.Decision ? (
    <Card proposal={proposal} {...props} />
  ) : (
    <ConvictionProposalCard proposal={proposal} {...props} />
  )
}

function ConvictionProposalCard({ proposal, ...props }) {
  const [proposalWithThreshold, loading] = useProposalWithThreshold(proposal)
  return <Card proposal={proposalWithThreshold} loading={loading} {...props} />
}

function Card({
  loading = false,
  proposal,
  onStakeToProposal,
  onVoteOnDecision,
  onWithdrawFromProposal,
}) {
  const theme = useTheme()
  const history = useHistory()

  const { below } = useViewport()

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
      <ProposalHeader
        proposal={proposal}
        onSelectProposal={handleSelectProposal}
      />
      <ProposalInfo
        loading={loading}
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
