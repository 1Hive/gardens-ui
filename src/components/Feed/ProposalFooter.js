import React, { useCallback, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import {
  ButtonBase,
  GU,
  Popover,
  textStyle,
  useLayout,
  useTheme,
} from '@1hive/1hive-ui'
import { ThumbsDownIcon, ThumbsUpIcon } from '../Icons'

import useAccountTokens from '../../hooks/useAccountTokens'
import { useAppState } from '../../providers/AppState'
import { useCanUserVote } from '../../hooks/useExtendedVoteData'
import useVoteGracePeriod from '../../hooks/useVoteGracePeriod'
import { useWallet } from '../../providers/Wallet'

import BigNumber from '../../lib/bigNumber'
import { durationTime } from '../../utils/date-utils'
import { getVoteStatus } from '../../utils/vote-utils'
import { getStatusAttributes } from '../DecisionDetail/VoteStatus'
import { isEntitySupporting } from '../../lib/conviction'
import {
  PCT_BASE,
  PROPOSAL_STATUS_ACTIVE_STRING,
  PROPOSAL_STATUS_CANCELLED_STRING,
  QUICK_STAKE_PCT,
  VOTE_NAY,
  VOTE_STATUS_ONGOING,
  VOTE_YEA,
} from '../../constants'
import { ProposalTypes } from '../../types'

import warningSvg from '../../assets/warning.svg'

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

    onStakeToProposal(proposal.id, amount.toFixed(0))
  }, [accountBalance, inactiveTokens, onStakeToProposal, proposal.id])

  const handleThumbsDown = useCallback(() => {
    // Withdraw all the staked tokens on the proposal
    onWithdrawFromProposal(proposal.id)
  }, [proposal.id, onWithdrawFromProposal])

  const canSupport = inactiveTokens.gt(0)
  const isSupporting = isEntitySupporting(proposal, account)

  // TODO: Use mapping and status symbol
  const proposalStatusLabel = useMemo(() => {
    if (proposal.status === PROPOSAL_STATUS_ACTIVE_STRING) {
      return 'Open'
    }

    if (proposal.status === PROPOSAL_STATUS_CANCELLED_STRING) {
      return 'Removed'
    }

    return 'Closed'
  }, [proposal.status])

  return (
    <Main color={theme.contentSecondary}>
      <div
        css={`
          display: flex;
          align-items: center;
        `}
      >
        {account && proposal.status === PROPOSAL_STATUS_ACTIVE_STRING && (
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
  const [warningPopoverVisible, setWarningPopoverVisible] = useState(false)

  const status = getVoteStatus(proposal, PCT_BASE)
  const { label: statusLabel } = getStatusAttributes(status, theme)

  const votesCount = proposal.casts.length
  const popoverOpener = useRef()

  const handleOnClosePopover = useCallback(() => {
    setWarningPopoverVisible(false)
  }, [setWarningPopoverVisible])

  const handleOpenPopover = useCallback(() => {
    setWarningPopoverVisible(true)
  }, [setWarningPopoverVisible])

  return (
    <Main color={theme.contentSecondary}>
      <div
        css={`
          display: flex;
          align-items: center;
        `}
      >
        {account && proposal.data.open && (
          <VoteActions proposal={proposal} onVote={onVoteOnDecision} />
        )}
        <div>
          {votesCount} Vote{votesCount === 1 ? '' : 's'}
        </div>
        {status === VOTE_STATUS_ONGOING && (
          <ButtonBase
            ref={popoverOpener}
            onClick={handleOpenPopover}
            css={`
              margin-left: ${1 * GU}px;
            `}
          >
            <img
              src={warningSvg}
              alt=""
              css={`
                display: block;
              `}
            />
          </ButtonBase>
        )}
      </div>
      <WarningPopover
        onClose={handleOnClosePopover}
        visible={warningPopoverVisible}
        ref={popoverOpener.current}
      />

      <div>Status: {statusLabel}</div>
    </Main>
  )
}

const WarningPopover = React.forwardRef(({ onClose, visible }, ref) => {
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'medium' || layoutName === 'small'

  const gracePeriodSeconds = useVoteGracePeriod()

  return (
    <Popover visible={visible} opener={ref} onClose={onClose}>
      <div
        css={`
      padding: ${3 * GU}px;
      ${textStyle('body3')}
      width:${compactMode ? 'auto' : 48 * GU}px;
      border: 1px solid #F5A623;
      border-radius: 16px;
    `}
      >
        Voting in favour of a decision will prevent you from transferring your
        balance until it has been executed or {durationTime(gracePeriodSeconds)}{' '}
        after the voting period ends.
      </div>
    </Popover>
  )
})

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
