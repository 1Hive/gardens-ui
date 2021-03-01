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
}) {
  const { stakeToken, accountBalance } = useAppState()
  const { account: connectedAccount } = useWallet()

  const { id, currentConviction, stakes, threshold } = proposal

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
    if (currentConviction.gte(threshold)) {
      return 'execute'
    }
    if (didIStake) {
      return 'update'
    }
    return 'support'
  }, [currentConviction, didIStake, threshold])

  const handleExecute = useCallback(() => {
    onExecuteProposal(id)
  }, [id, onExecuteProposal])

  const buttonProps = useMemo(() => {
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
    return {
      text: 'Support this proposal',
      action: onRequestSupportProposal,
      mode: 'strong',
      disabled: !accountBalance.gt(0),
    }
  }, [
    accountBalance,
    handleExecute,
    mode,
    onChangeSupport,
    onRequestSupportProposal,
  ])

  return connectedAccount ? (
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
  ) : (
    <AccountNotConnected />
  )
}

export default ProposalActions
