import React from 'react'
import { GU, Help, Link, useTheme } from '@1hive/1hive-ui'
import Balance from '../Balance'
import Stream from '../Stream'
import ProposalCountdown from './ProposalCountdown'
import ProposalDescription from './ProposalDescription'
import ProposalSupport from './ProposalSupport'

import Loading from '@/components/Loading'
import useSuperfluidCFAv1 from '@/hooks/useSignalingProposalType'
import { useGardenState } from '@providers/GardenState'
import { formatTokenAmount } from '@utils/token-utils'
import { ProposalTypes } from '@/types'
import { ProposalType } from '@/types/app'

type ProposalInfoProps = {
  loading: boolean
  proposal: ProposalType
  onSelectProposal: () => void
}

function ProposalInfo({
  loading,
  proposal,
  onSelectProposal,
}: ProposalInfoProps) {
  const theme = useTheme()
  const { config } = useGardenState()
  const { flow, loading: loadingFlow } = useSuperfluidCFAv1(
    proposal.beneficiary
  )
  const { requestToken, stableToken } = config.conviction
  const primaryToken = proposal.stable ? stableToken : requestToken

  const formatedAmount = formatTokenAmount(
    proposal.requestedAmountConverted,
    requestToken.decimals
  )

  return (
    <div onClick={onSelectProposal}>
      <ProposalDescription proposal={proposal} />
      {proposal.type === ProposalTypes.Proposal && (
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
                <Loading />
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
                    {`${formatedAmount} ${requestToken.symbol}`}
                  </span>
                  <Help hint="">
                    Converted to {requestToken.symbol} at time of execution. For
                    funding proposals denominated in {stableToken.symbol} to be
                    made successfully, this Garden&apos;s{' '}
                    <Link href="https://1hive.gitbook.io/gardens/garden-creators/price-oracle">
                      price oracle
                    </Link>{' '}
                    must be called consistently. Contact your Garden
                    administrator or development team if the proposal execution
                    transaction is continually failing or if the request stable
                    amount is not accurate.
                  </Help>
                </div>
              )}
            </>
          )}
        </div>
      )}
      {proposal.type === ProposalTypes.Stream && (
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
            Streaming:
          </span>
          {loadingFlow ? (
            <div
              css={`
                align-items: left;
              `}
            >
              <Loading />
            </div>
          ) : (
            <>
              <Stream
                flowRateConvertions={flow.flowRateConvertions}
                decimals={primaryToken.decimals}
                icon={primaryToken.icon}
                symbol={primaryToken.symbol}
              />
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
