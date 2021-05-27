import React from 'react'
import { GU, Help, LoadingRing, useTheme } from '@1hive/1hive-ui'
import Balance from '../Balance'
import ProposalCountdown from './ProposalCountdown'
import ProposalDescription from './ProposalDescription'
import ProposalSupport from './ProposalSupport'

import { ProposalTypes } from '@/types'
import { useGardenState } from '@providers/GardenState'
import { formatTokenAmount } from '@utils/token-utils'

function ProposalInfo({ loading, proposal, onSelectProposal }) {
  const theme = useTheme()
  const { config } = useGardenState()
  const { requestToken, stableToken } = config.conviction
  const primaryToken = proposal.stable ? stableToken : requestToken

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
            decimals={primaryToken.decimals}
            icon={primaryToken.icon}
            symbol={primaryToken.symbol}
          />
          {proposal.stable && (
            <>
              {loading ? (
                <LoadingRing />
              ) : (
                <div
                  css={`
                    display: flex;
                    align-items: center;
                    color: ${theme.contentSecondary};
                    margin-left: ${0.5 * GU}px;
                  `}
                >
                  <span>≈</span>
                  <span
                    css={`
                      margin: 0px ${0.5 * GU}px;
                    `}
                  >
                    {formatTokenAmount(
                      proposal.requestedAmountConverted,
                      requestToken.decimals
                    )}{' '}
                    {requestToken.symbol}
                  </span>
                  <Help hint="">
                    Converted to {requestToken.name} at time of execution
                  </Help>
                </div>
              )}
            </>
          )}
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
