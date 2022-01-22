import React from 'react'
import { GU, Tag, textStyle, useTheme } from '@1hive/1hive-ui'

import { ConvictionBar } from '../ConvictionVisuals'
import SummaryBar from '../DecisionDetail/SummaryBar' // TODO: Move to root component folder
import SummaryRow from '../DecisionDetail/SummaryRow'

import { useGardenState } from '@providers/GardenState'
import { useWallet } from '@providers/Wallet'
import { ProposalTypes } from '@/types'
import { safeDiv } from '@utils/math-utils'
import { getConnectedAccountCast } from '@utils/vote-utils'
import { VOTE_NAY, VOTE_YEA } from '@/constants'
import { ProposalType } from '@/hooks/constants'
import styled from 'styled-components'

type ProposalSupportProps = {
  proposal: ProposalType
  isAbstainProposal?: boolean
}

function ProposalSupport({
  proposal,
  isAbstainProposal = false,
}: ProposalSupportProps) {
  const theme = useTheme()
  const { config } = useGardenState()
  const { requestToken } = config.conviction

  return (
    <ProposalSupportWrapper isAbstainProposal={isAbstainProposal}>
      <div
        css={`
          ${textStyle('label2')};
          color: ${theme.contentSecondary};
        `}
      >
        Current {proposal.type !== ProposalTypes.Decision ? 'support' : 'votes'}
      </div>
      {proposal.type !== ProposalTypes.Decision ? (
        <div>
          <ConvictionBar
            proposal={proposal}
            withThreshold={Boolean(requestToken)}
            isAbstainProposal={isAbstainProposal}
          />
        </div>
      ) : (
        <DecisionSummaryBar proposal={proposal} />
      )}
    </ProposalSupportWrapper>
  )
}

const ProposalSupportWrapper = styled.div<{
  isAbstainProposal: boolean
}>`
  margin-bottom: ${({ isAbstainProposal }) =>
    isAbstainProposal ? 0 : 2 * GU}px;
`

type DecisionSummaryBarProps = {
  proposal: ProposalType
}

function DecisionSummaryBar({ proposal }: DecisionSummaryBarProps) {
  const theme = useTheme()
  const { account: connectedAccount } = useWallet()
  const { minAcceptQuorum, nay, yea } = proposal

  const totalVotes = parseFloat(yea) + parseFloat(nay)
  const yeasPct = safeDiv(parseFloat(yea), totalVotes)
  const naysPct = safeDiv(parseFloat(nay), totalVotes)

  const connectedAccountCast = getConnectedAccountCast(
    proposal,
    connectedAccount
  )

  const YouTag = (
    <div>
      <Tag
        background={undefined}
        color={undefined}
        limitDigits={undefined}
        icon={undefined}
        label={undefined}
        mode={undefined}
        size={undefined}
        uppercase={undefined}
      >
        You
      </Tag>
    </div>
  )

  return (
    <div>
      <SummaryBar
        positiveSize={yeasPct}
        negativeSize={naysPct}
        requiredSize={minAcceptQuorum}
        css="margin: 0; height: 24px;"
        disabledProgressBars={false}
      />
      <div
        css={`
          display: flex;
          align-items: center;
          justify-content: space-between;
        `}
      >
        <div
          css={`
            display: flex;
            align-items: flex-start;
            width: auto;
          `}
        >
          <SummaryRow
            color={theme.positive}
            label="Yes"
            pct={Math.floor(yeasPct * 100)}
            css={`
              margin-right: ${1 * GU}px;
            `}
            token={null}
          />
          {connectedAccountCast.vote === VOTE_YEA && YouTag}
        </div>
        <div
          css={`
            display: flex;
            align-items: flex-start;
            width: auto;
          `}
        >
          {connectedAccountCast.vote === VOTE_NAY && YouTag}
          <SummaryRow
            color={theme.negative}
            label="No"
            pct={Math.floor(naysPct * 100)}
            css={`
              margin-left: ${1 * GU}px;
            `}
            token={null}
          />
        </div>
      </div>
    </div>
  )
}

export default ProposalSupport
