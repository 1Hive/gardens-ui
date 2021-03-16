import React, { useCallback, useMemo } from 'react'
import { Button, GU, Info } from '@1hive/1hive-ui'

import { useAppState } from '../../providers/AppState'
import { useWallet } from '../../providers/Wallet'

import AccountNotConnected from '../AccountNotConnected'
import { addressesEqual } from '../../utils/web3-utils'
import BigNumber from '../../lib/bigNumber'

function ProposalActions({
  proposal,
  onChangeSupport,
  onExecuteProposal,
  onRequestSupportProposal,
  onWithdrawFromProposal,
}) {
  const { stakeToken, accountBalance } = useAppState()
  const { account: connectedAccount } = useWallet()

  const { id, currentConviction, hasEnded, stakes, threshold } = proposal

  const myStake = useMemo(
    () =>
      stakes.find(({ entity }) =>
        addressesEqual(entity.id, connectedAccount)
      ) || {
        amount: new BigNumber('0'),
      },
    [stakes, connectedAccount]
  )

  const didIStake = myStake?.amount.gt(0)

  const mode = useMemo(() => {
    if (didIStake && hasEnded) {
      return 'withdraw'
    }
    if (currentConviction.gte(threshold)) {
      return 'execute'
    }
    if (didIStake) {
      return 'update'
    }
    if (hasEnded) {
      return null
    }
    return 'support'
  }, [currentConviction, didIStake, hasEnded, threshold])

  const handleExecute = useCallback(() => {
    onExecuteProposal(id)
  }, [id, onExecuteProposal])

  const handleWithdrawAllFromProposal = useCallback(() => {
    onWithdrawFromProposal(id)
  }, [id, onWithdrawFromProposal])

  const buttonProps = useMemo(() => {
    if (!mode) {
      return null
    }
    if (mode === 'execute') {
      return {
        text: 'Execute proposal',
        action: handleExecute,
        mode: 'strong',
        disabled: false,
      }
    }

    if (mode === 'update') {
      return {
        text: 'Change support',
        action: onChangeSupport,
        mode: 'normal',
      }
    }
    if (mode === 'withdraw') {
      return {
        text: 'Withdraw stake',
        action: handleWithdrawAllFromProposal,
        mode: 'strong',
      }
    }
    if (mode === 'support') {
      return {
        text: 'Support this proposal',
        action: onRequestSupportProposal,
        mode: 'strong',
        disabled: !accountBalance.gt(0),
      }
    }
  }, [
    accountBalance,
    handleExecute,
    handleWithdrawAllFromProposal,
    mode,
    onChangeSupport,
    onRequestSupportProposal,
  ])

  if (mode) {
    if (!connectedAccount) {
      return <AccountNotConnected />
    }
    return (
      <div>
        <Button
          wide
          mode={buttonProps.mode}
          onClick={buttonProps.action}
          disabled={buttonProps.disabled}
        >
          {buttonProps.text}
        </Button>
        {mode === 'support' && buttonProps.disabled && (
          <Info
            mode="warning"
            css={`
              margin-top: ${2 * GU}px;
            `}
          >
            The currently connected account does not hold any{' '}
            <strong>{stakeToken.symbol}</strong> tokens and therefore cannot
            participate in this proposal. Make sure your account is holding{' '}
            <strong>{stakeToken.symbol}</strong>.
          </Info>
        )}
      </div>
    )
  }

  return null
}

export default ProposalActions
