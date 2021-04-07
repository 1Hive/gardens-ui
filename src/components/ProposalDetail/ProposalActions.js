import React, { useCallback, useMemo, useState } from 'react'
import { Button, Field, GU, Info, Slider, TextInput } from '@1hive/1hive-ui'

import useAccountTotalStaked from '../../hooks/useAccountTotalStaked'
import { useAppState } from '../../providers/AppState'
import { useWallet } from '../../providers/Wallet'

import AccountNotConnected from '../AccountNotConnected'
import { addressesEqual } from '../../utils/web3-utils'
import BigNumber from '../../lib/bigNumber'
import { toDecimals, fromDecimals } from '../../utils/math-utils'

import {
  PROPOSAL_STATUS_ACTIVE_STRING,
  PROPOSAL_STATUS_CANCELLED_STRING,
  PROPOSAL_STATUS_EXECUTED_STRING,
} from '../../constants'

const MAX_INPUT_DECIMAL_BASE = 6

function ProposalActions({
  proposal,
  onExecuteProposal,
  onRequestSupportProposal,
  onStakeToProposal,
  onWithdrawFromProposal,
}) {
  const { stakeToken, accountBalance } = useAppState()
  const { account: connectedAccount } = useWallet()

  const { id, currentConviction, stakes, status, threshold } = proposal
  const totalStaked = useAccountTotalStaked(connectedAccount)

  const myStake = useMemo(
    () =>
      stakes.find(({ entity }) =>
        addressesEqual(entity.id, connectedAccount)
      ) || {
        amount: new BigNumber('0'),
      },
    [stakes, connectedAccount]
  )

  const maxAvailable = useMemo(
    () => accountBalance.minus(totalStaked).plus(myStake.amount),
    [myStake.amount, accountBalance, totalStaked]
  )

  const [
    inputValue, // tokens amount formatted as a string
    amount, // tokens amount formatted as a big number
    handleAmountChange,
    handleSliderChange,
  ] = useAmount(myStake, stakeToken, maxAvailable)

  const didIStake = myStake?.amount.gt(0)

  const mode = useMemo(() => {
    if (
      didIStake &&
      (status === PROPOSAL_STATUS_CANCELLED_STRING ||
        status === PROPOSAL_STATUS_EXECUTED_STRING)
    ) {
      return 'withdraw'
    }
    if (currentConviction.gte(threshold)) {
      return 'execute'
    }
    if (didIStake) {
      return 'update'
    }
    return 'support'
  }, [currentConviction, didIStake, status, threshold])

  const handleExecute = useCallback(() => {
    onExecuteProposal(id)
  }, [id, onExecuteProposal])

  const handleChangeSupport = useCallback(() => {
    if (amount.lt(myStake.amount)) {
      onWithdrawFromProposal(
        id,
        myStake.amount
          .minus(amount)
          .integerValue()
          .toString(10)
      )
      return
    }

    onStakeToProposal(
      id,
      amount
        .minus(myStake.amount)
        .integerValue()
        .toString(10)
    )
  }, [amount, id, myStake.amount, onStakeToProposal, onWithdrawFromProposal])

  const handleWithdrawAllFromProposal = useCallback(() => {
    onWithdrawFromProposal(id)
  }, [id, onWithdrawFromProposal])

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
        text: amount.toString() === '0' ? 'Withdraw support' : 'Change support',
        action: handleChangeSupport,
        mode: 'normal',
        disabled: myStake.amount.toString() === amount.toString(),
      }
    }
    if (mode === 'withdraw') {
      return {
        text: 'Withdraw stake',
        action: handleWithdrawAllFromProposal,
        mode: 'strong',
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
    amount,
    handleChangeSupport,
    handleExecute,
    handleWithdrawAllFromProposal,
    mode,
    myStake.amount,
    onRequestSupportProposal,
  ])

  return connectedAccount ? (
    <div>
      {mode === 'update' && (
        <Field label="Amount of your tokens for this proposal">
          <div
            css={`
              display: flex;
              justify-content: space-between;
            `}
          >
            <Slider
              value={
                maxAvailable.gt(0) ? amount.div(maxAvailable).toNumber() : 0
              }
              onUpdate={handleSliderChange}
              css={`
                padding-left: 0;
                width: 100%;
              `}
            />
            <TextInput
              value={inputValue}
              type="number"
              onChange={handleAmountChange}
              max={fromDecimals(maxAvailable.toString(), stakeToken.decimals)}
              min="0"
              step="any"
              css={`
                width: ${18 * GU}px;
              `}
            />
          </div>
        </Field>
      )}
      {(status === PROPOSAL_STATUS_ACTIVE_STRING || mode === 'withdraw') && (
        <Button
          wide
          mode={buttonProps.mode}
          onClick={buttonProps.action}
          disabled={buttonProps.disabled}
        >
          {buttonProps.text}
        </Button>
      )}
      {status === PROPOSAL_STATUS_ACTIVE_STRING &&
        mode === 'support' &&
        buttonProps.disabled && (
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

const useAmount = (myStake, stakeToken, maxAvailable) => {
  const [inputValue, setInputValue] = useState(
    myStake?.amount &&
      fromDecimals(myStake.amount.toString(), stakeToken.decimals)
  )

  const roundSlider = useCallback(
    bigNum =>
      bigNum
        .shiftedBy(-stakeToken.decimals)
        .decimalPlaces(Math.min(MAX_INPUT_DECIMAL_BASE, stakeToken.decimals))
        .toString(),
    [stakeToken.decimals]
  )

  const handleAmountChange = useCallback(
    event => setInputValue(event.target.value),
    []
  )

  const handleSliderChange = useCallback(
    newProgress =>
      setInputValue(roundSlider(maxAvailable.multipliedBy(newProgress))),
    [maxAvailable, roundSlider]
  )

  const amount = BigNumber.minimum(
    new BigNumber(toDecimals(inputValue, stakeToken.decimals)),
    maxAvailable
  )

  return [inputValue, amount, handleAmountChange, handleSliderChange]
}

export default ProposalActions
