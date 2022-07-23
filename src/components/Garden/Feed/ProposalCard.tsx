import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { GU, useTheme, useViewport } from '@1hive/1hive-ui'

import ProposalFooter from './ProposalFooter'
import ProposalHeader from './ProposalHeader'
import ProposalInfo from './ProposalInfo'
import { useProposalWithThreshold } from '@hooks/useProposals'

import { buildGardenPath } from '@utils/routing-utils'
import { ProposalTypes } from '@/types'
import { ProposalType } from '@/types/app'

type CardProps = {
  loading?: boolean
  proposal: ProposalType
}

function ProposalCard({ proposal, ...props }: CardProps) {
  return proposal.type === ProposalTypes.Decision ? (
    <Card proposal={proposal} {...props} />
  ) : (
    <ConvictionProposalCard proposal={proposal} {...props} />
  )
}

function ConvictionProposalCard({ proposal, ...props }: CardProps) {
  const [proposalWithThreshold, loading] = useProposalWithThreshold(proposal)
  return <Card proposal={proposalWithThreshold} loading={loading} {...props} />
}

function Card({ loading = false, proposal }: CardProps) {
  const theme = useTheme()
  const history = useHistory()
  const { below } = useViewport()

  const handleSelectProposal = useCallback(() => {
    const entityPath =
      proposal.type === ProposalTypes.Decision ? 'vote' : 'proposal'

    const path = buildGardenPath(
      history.location,
      `${entityPath}/${proposal.number}`
    )
    history.push(path)
  }, [history, proposal.number, proposal.type])

  const handleViewProfile = useCallback(
    (proposalCreator) => {
      history.push(`/profile?account=${proposalCreator}`)
    },
    [history]
  )

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
        onViewProfile={handleViewProfile}
      />
      <ProposalInfo
        loading={loading}
        proposal={proposal}
        onSelectProposal={handleSelectProposal}
      />
      {proposal.type !== ProposalTypes.Poll ? (
        <ProposalFooter
          proposal={proposal}
          onSelectProposal={handleSelectProposal}
        />
      ) : null}
    </div>
  )
}

export default React.memo(ProposalCard)
