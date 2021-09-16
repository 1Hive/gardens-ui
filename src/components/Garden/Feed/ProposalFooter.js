import React, { useMemo } from 'react'
import styled from 'styled-components'
import { textStyle, useTheme } from '@1hive/1hive-ui'
import { ThumbsDownIcon, ThumbsUpIcon } from '../Icons'

import { useGardenState } from '@providers/GardenState'
import { useWallet } from '@providers/Wallet'

import { getStatusAttributes } from '../DecisionDetail/VoteStatus'
import { VOTE_NAY, VOTE_YEA } from '@/constants'
import { ProposalTypes } from '@/types'
import { formatTokenAmount } from '@utils/token-utils'
import { getConnectedAccountVote } from '../../../utils/vote-utils'

function ProposalCardFooter({ proposal }) {
  if (proposal.type === ProposalTypes.Decision) {
    return <DecisionFooter proposal={proposal} />
  }

  return <ProposalFooter proposal={proposal} />
}

function ProposalFooter({ proposal }) {
  const { config } = useGardenState()
  const { stakeToken } = config.conviction
  const theme = useTheme()

  const supportersCount = useMemo(
    () => proposal.stakes.filter(({ amount }) => amount.gt(0)).length,
    [proposal]
  )

  const formattedNeededTokens = formatTokenAmount(
    proposal.neededTokens,
    stakeToken.decimals
  )

  // TODO: Use mapping and status symbol
  const proposalStatusLabel = useMemo(() => {
    if (proposal.statusData.open) {
      return 'Open'
    }

    if (proposal.statusData.rejected) {
      return 'Rejected'
    }

    if (proposal.statusData.cancelled) {
      return 'Cancelled'
    }

    if (proposal.statusData.settled) {
      return 'Settled'
    }

    if (proposal.statusData.challenged) {
      return 'Challenged'
    }

    if (proposal.statusData.disputed) {
      return 'Waiting for celeste'
    }

    return 'Closed'
  }, [proposal.statusData])

  return (
    <Main color={theme.contentSecondary}>
      <div>
        {supportersCount} Supporter{supportersCount === 1 ? '' : 's'}
      </div>
      {proposal.type === ProposalTypes.Proposal && (
        <div>
          {stakeToken.symbol} needed to pass: {formattedNeededTokens}
        </div>
      )}
      <div>Status: {proposalStatusLabel}</div>
    </Main>
  )
}

function DecisionFooter({ proposal }) {
  const theme = useTheme()
  const { account } = useWallet()
  const { label: statusLabel } = getStatusAttributes(proposal, theme)

  const votesCount = proposal.casts.length

  return (
    <Main color={theme.contentSecondary}>
      <div
        css={`
          display: flex;
          align-items: center;
        `}
      >
        {account && <SupportIndicator account={account} vote={proposal} />}
        <div>
          {votesCount} Vote{votesCount === 1 ? '' : 's'}
        </div>
      </div>
      <div>Status: {statusLabel}</div>
    </Main>
  )
}

function SupportIndicator({ account, vote }) {
  const accountVote = getConnectedAccountVote(vote, account)

  if (accountVote === VOTE_YEA) {
    return <ThumbsUpIcon />
  } else if (accountVote === VOTE_NAY) {
    return <ThumbsDownIcon />
  }

  return null
}

const Main = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  color: ${({ color }) => color};
  ${textStyle('body3')};
`

export default ProposalCardFooter
