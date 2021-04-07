import React from 'react'
import { GU, useTheme } from '@1hive/1hive-ui'
import Balance from '../Balance'
import ProposalCountdown from './ProposalCountdown'
import ProposalDescription from './ProposalDescription'
import ProposalSupport from './ProposalSupport'
import { ProposalTypes } from '../../types'
import { useAppState } from '../../providers/AppState'

import honeySvg from '../../assets/honey.svg'

function ProposalInfo({ proposal, onSelectProposal }) {
  const theme = useTheme()
  const { requestToken } = useAppState()
  return (
    <div>
      <ProposalDescription
        proposal={proposal}
        onSelectProposal={onSelectProposal}
      />
      {proposal.type !== ProposalTypes.Decision && (
        <div
          css={`
            display: flex;
            align-items: center;
            color: ${theme.contentSecondary};
            margin-bottom: ${2 * GU}px;
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
      <ProposalSupport proposal={proposal} />
      {proposal.type === ProposalTypes.Decision && (
        <ProposalCountdown proposal={proposal} />
      )}
    </div>
  )
}

export default ProposalInfo
