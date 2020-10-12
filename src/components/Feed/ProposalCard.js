import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { GU, textStyle, useTheme } from '@1hive/1hive-ui'

import Balance from '../Balance'
import ProposalFooter from './ProposalFooter'
import ProposalHeader from './ProposalHeader'
import ProposalSupport from './ProposalSupport'

import { useAppState } from '../../providers/AppState'

import { ProposalTypes } from '../../types'
import honeySvg from '../../assets/honey.svg'

function ProposalCard({ proposal, onStakeToProposal, onWithdrawFromProposal }) {
  const theme = useTheme()
  const history = useHistory()
  const { requestToken } = useAppState()

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
      <div
        onClick={handleSelectProposal}
        css={`
          cursor: pointer;
          ${textStyle('body1')};
          margin-bottom: ${3 * GU}px;
        `}
      >
        {proposal.name}
      </div>
      {proposal.type === ProposalTypes.Proposal && (
        <div
          css={`
            margin-bottom: ${2 * GU}px;
            display: flex;
            align-items: center;
            color: ${theme.contentSecondary};
          `}
        >
          <span
            css={`
              margin-right: ${1 * GU}px;
            `}
          >
            Request:
          </span>
          <Balance
            amount={proposal.requestedAmount}
            decimals={requestToken.decimals}
            icon={honeySvg}
            symbol={requestToken.symbol}
          />
        </div>
      )}
      <div
        css={`
          margin-bottom: ${2 * GU}px;
        `}
      >
        <div
          css={`
            ${textStyle('label2')};
            color: ${theme.contentSecondary};
          `}
        >
          Current{' '}
          {proposal.type !== ProposalTypes.Decision ? 'support' : 'votes'}
        </div>
        <ProposalSupport proposal={proposal} />
      </div>
      <ProposalFooter
        proposal={proposal}
        onStakeToProposal={onStakeToProposal}
        onWithdrawFromProposal={onWithdrawFromProposal}
      />
    </div>
  )
}

export default ProposalCard
