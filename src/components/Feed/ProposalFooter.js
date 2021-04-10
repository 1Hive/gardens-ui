import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { ButtonBase, GU, textStyle, useTheme } from '@1hive/1hive-ui'
import { ThumbsDownIcon, ThumbsUpIcon } from '../Icons'

import useAccountTokens from '../../hooks/useAccountTokens'
import { useAppState } from '../../providers/AppState'
import { useCanUserVote } from '../../hooks/useExtendedVoteData'
import { useWallet } from '../../providers/Wallet'

import BigNumber from '../../lib/bigNumber'
import { getStatusAttributes } from '../DecisionDetail/VoteStatus'
import { isEntitySupporting } from '../../lib/conviction'
import { PCT_BASE, QUICK_STAKE_PCT, VOTE_NAY, VOTE_YEA } from '../../constants'
import { ProposalTypes } from '../../types'

function ProposalCardFooter({
  proposal,
  onStakeToProposal,
  onVoteOnDecision,
  onWithdrawFromProposal,
}) {
  if (proposal.type === ProposalTypes.Decision) {
    return (
      <DecisionFooter proposal={proposal} onVoteOnDecision={onVoteOnDecision} />
    )
  }

  return (
    <ProposalFooter
      proposal={proposal}
      onStakeToProposal={onStakeToProposal}
      onWithdrawFromProposal={onWithdrawFromProposal}
    />
  )
}

function ProposalFooter({
  proposal,
  onStakeToProposal,
  onWithdrawFromProposal,
}) {
  const theme = useTheme()
  const { account } = useWallet()
  const { accountBalance } = useAppState()
  const { inactiveTokens } = useAccountTokens(account, accountBalance)

  const supportersCount = useMemo(
    () => proposal.stakes.filter(({ amount }) => amount.gt(0)).length,
    [proposal]
  )

  const handleThumbsUp = useCallback(() => {
    // Staking the minimum between account's inactive tokens and 5% of account's balance
    const amount = BigNumber.min(
      inactiveTokens,
      accountBalance.times(QUICK_STAKE_PCT).div(PCT_BASE)
    )

    onStakeToProposal({ proposalId: proposal.id, amount: amount.toFixed(0) })
  }, [accountBalance, inactiveTokens, onStakeToProposal, proposal.id])

  const handleThumbsDown = useCallback(() => {
    // Withdraw all the staked tokens on the proposal
    onWithdrawFromProposal({ proposalId: proposal.id })
  }, [proposal.id, onWithdrawFromProposal])

  const canSupport = inactiveTokens.gt(0)
  const isSupporting = isEntitySupporting(proposal, account)

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
      <div
        css={`
          display: flex;
          align-items: center;
        `}
      >
        {account && proposal.statusData.open && (
          <QuickActions
            canThumbsUp={canSupport}
            canThumbsDown={isSupporting}
            onThumbsUp={handleThumbsUp}
            onThumbsDown={handleThumbsDown}
          />
        )}
        <div>
          {supportersCount} Supporter{supportersCount === 1 ? '' : 's'}
        </div>
      </div>
      <div>Status: {proposalStatusLabel}</div>
    </Main>
  )
}

function DecisionFooter({ proposal, onVoteOnDecision }) {
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
        {account && proposal.statusData.open && (
          <VoteActions proposal={proposal} onVote={onVoteOnDecision} />
        )}
        <div>
          {votesCount} Vote{votesCount === 1 ? '' : 's'}
        </div>
      </div>
      <div>Status: {statusLabel}</div>
    </Main>
  )
}

function VoteActions({ proposal, onVote }) {
  const handleThumbsUp = useCallback(() => {
    onVote(proposal.id, VOTE_YEA)
  }, [onVote, proposal.id])

  const handleThumbsDown = useCallback(() => {
    onVote(proposal.id, VOTE_NAY)
  }, [onVote, proposal.id])

  const { canUserVote } = useCanUserVote(proposal)

  return (
    <QuickActions
      canThumbsUp={canUserVote}
      canThumbsDown={canUserVote}
      onThumbsUp={handleThumbsUp}
      onThumbsDown={handleThumbsDown}
    />
  )
}

function QuickActions({
  canThumbsUp,
  canThumbsDown,
  onThumbsUp,
  onThumbsDown,
}) {
  return (
    <div
      css={`
        display: flex;
        align-items: center;
      `}
    >
      <ButtonBase
        onClick={canThumbsUp ? onThumbsUp : null}
        css={`
          display: flex;
          margin-right: ${1 * GU}px;
        `}
        disabled={!canThumbsUp}
      >
        <ThumbsUpIcon disabled={!canThumbsUp} />
      </ButtonBase>

      <ButtonBase
        onClick={canThumbsDown ? onThumbsDown : null}
        css={`
          display: flex;
          margin-right: ${1.5 * GU}px;
        `}
        disabled={!canThumbsDown}
      >
        <ThumbsDownIcon disabled={!canThumbsDown} />
      </ButtonBase>
    </div>
  )
}

const Main = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  color: ${({ color }) => color};
  ${textStyle('body3')};
`

export default ProposalCardFooter
