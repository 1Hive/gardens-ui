import React from 'react'
import { GU, Tag, textStyle, useTheme } from '@1hive/1hive-ui'

import { ConvictionBar } from '../ConvictionVisuals'
import SummaryBar from '../DecisionDetail/SummaryBar' // TODO: Move to root component folder
import SummaryRow from '../DecisionDetail/SummaryRow'

import { useAppState } from '../../providers/AppState'
import { useWallet } from '../../providers/Wallet'
import { ProposalTypes } from '../../types'
import { safeDiv } from '../../utils/math-utils'
import { getConnectedAccountVote } from '../../utils/vote-utils'
import { VOTE_NAY, VOTE_YEA } from '../../constants'

function ProposalSupport({ proposal }) {
  const theme = useTheme()
  const { requestToken } = useAppState()

  return (
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
        Current {proposal.type !== ProposalTypes.Decision ? 'support' : 'votes'}
      </div>
      {proposal.type !== ProposalTypes.Decision ? (
        <div>
          <ConvictionBar
            proposal={proposal}
            withThreshold={Boolean(requestToken)}
          />
        </div>
      ) : (
        <DecisionSummaryBar proposal={proposal} />
      )}
    </div>
  )
}

function DecisionSummaryBar({ proposal }) {
  const theme = useTheme()
  const { account: connectedAccount } = useWallet()
  const { minAcceptQuorum, nay, yea } = proposal

  const totalVotes = parseFloat(yea) + parseFloat(nay)
  const yeasPct = safeDiv(parseFloat(yea), totalVotes)
  const naysPct = safeDiv(parseFloat(nay), totalVotes)

  const connectedAccountVote = getConnectedAccountVote(
    proposal,
    connectedAccount
  )

  const YouTag = (
    <div>
      <Tag>You</Tag>
    </div>
  )

  return (
    <div>
      <SummaryBar
        positiveSize={yeasPct}
        negativeSize={naysPct}
        requiredSize={minAcceptQuorum}
        css="margin: 0; height: 24px;"
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
          />
          {connectedAccountVote === VOTE_YEA && YouTag}
        </div>
        <div
          css={`
            display: flex;
            align-items: flex-start;
            width: auto;
          `}
        >
          {connectedAccountVote === VOTE_NAY && YouTag}
          <SummaryRow
            color={theme.negative}
            label="No"
            pct={Math.floor(naysPct * 100)}
            css={`
              margin-left: ${1 * GU}px;
            `}
          />
        </div>
      </div>
    </div>
  )
}

export default ProposalSupport
