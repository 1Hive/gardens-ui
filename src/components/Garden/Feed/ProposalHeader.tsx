import React from 'react'
import {
  GU,
  IconInfo,
  ContextMenu,
  ContextMenuItem,
  useLayout,
} from '@1hive/1hive-ui'
import ProposalCreator from './ProposalCreator'
import { ProposalType } from '@/types/app'

type ProposalHeaderProps = {
  proposal: ProposalType
  onSelectProposal: () => void
  onViewProfile: (proposalCreator: string) => void
}

function ProposalHeader({
  proposal,
  onSelectProposal,
  onViewProfile,
}: ProposalHeaderProps) {
  const { layoutName } = useLayout()

  return (
    <div
      css={`
        margin-bottom: ${3 * GU}px;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
      `}
    >
      <ProposalCreator
        proposal={proposal}
        onViewProfile={() => onViewProfile(proposal.creator)}
      />
      {layoutName !== 'small' && (
        <ContextMenu>
          <ContextMenuItem onClick={onSelectProposal}>
            <IconInfo /> Details
          </ContextMenuItem>
        </ContextMenu>
      )}
    </div>
  )
}

export default ProposalHeader
