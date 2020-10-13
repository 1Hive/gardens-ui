import React from 'react'
import { GU, IconInfo, ContextMenu, ContextMenuItem } from '@1hive/1hive-ui'
import ProposalCreator from './ProposalCreator'

function ProposalHeader({ proposal, onSelectProposal }) {
  return (
    <div
      css={`
        margin-bottom: ${3 * GU}px;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
      `}
    >
      <ProposalCreator proposal={proposal} />
      <ContextMenu>
        <ContextMenuItem onClick={onSelectProposal}>
          <IconInfo /> Details
        </ContextMenuItem>
      </ContextMenu>
    </div>
  )
}

export default ProposalHeader
