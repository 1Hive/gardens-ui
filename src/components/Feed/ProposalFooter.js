import React, { useCallback, useMemo } from 'react'
import { GU, textStyle, useTheme } from '@1hive/1hive-ui'
import { ThumbsDownIcon, ThumbsUpIcon } from '../Icons'

import { useAppState } from '../../providers/AppState'
import useAccountTokens from '../../hooks/useAccountTokens'
import { useWallet } from '../../providers/Wallet'

import BigNumber from '../../lib/bigNumber'
import { isEntitySupporting } from '../../lib/conviction'
import { QUICK_STAKE_PCT, STAKE_PCT_BASE } from '../../constants'

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
      accountBalance.times(QUICK_STAKE_PCT).div(STAKE_PCT_BASE)
    )

    onStakeToProposal(proposal.id, amount.toFixed(0))
  }, [accountBalance, inactiveTokens, onStakeToProposal, proposal.id])

  const handleThumbsDown = useCallback(() => {
    // Withdraw all the staked tokens on the proposal
    onWithdrawFromProposal(proposal.id)
  }, [proposal.id, onWithdrawFromProposal])

  return (
    <div>
      <div
        css={`
          display: flex;
          align-items: center;
          justify-content: space-between;

          color: ${theme.contentSecondary};
          ${textStyle('body3')};
        `}
      >
        <div
          css={`
            display: flex;
            align-items: center;
          `}
        >
          <QuickActions
            canSupport={inactiveTokens.gt(0)}
            proposal={proposal}
            onThumbsUp={handleThumbsUp}
            onThumbsDown={handleThumbsDown}
          />
          <div>
            {supportersCount} Supporter{supportersCount === 1 ? '' : 's'}
          </div>
        </div>
        <div>Status : {proposal.status}</div>
      </div>
    </div>
  )
}

// TODO: Add logic for dandelion votes
function QuickActions({ canSupport, proposal, onThumbsUp, onThumbsDown }) {
  const { account } = useWallet()

  if (!account) {
    return null
  }

  const isSupporting = isEntitySupporting(proposal, account)

  return (
    <div
      css={`
        display: flex;
        align-items: center;
      `}
    >
      <div
        onClick={canSupport ? onThumbsUp : null}
        css={`
          display: flex;
          margin-right: ${1 * GU}px;
          ${canSupport && 'cursor: pointer'};
        `}
      >
        <ThumbsUpIcon disabled={!canSupport} />
      </div>

      <div
        onClick={isSupporting ? onThumbsDown : null}
        css={`
          display: flex;
          margin-right: ${1.5 * GU}px;
          ${isSupporting && 'cursor: pointer'};
        `}
      >
        <ThumbsDownIcon disabled={!isSupporting} />
      </div>
    </div>
  )
}

export default ProposalFooter
