import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Field, GU, Info, Slider, TextInput } from '@1hive/1hive-ui'

import useAccountTotalStaked from '../hooks/useAccountTotalStaked'
import { useAppState } from '../providers/AppState'
import { useWallet } from '../providers/Wallet'

import { addressesEqual } from '../lib/web3-utils'
import BigNumber from '../lib/bigNumber'
import { formatTokenAmount } from '../lib/token-utils'
import { round, safeDiv, toDecimals } from '../lib/math-utils'
import AccountNotConnected from './AccountNotConnected'

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
  const { id, currentConviction, stakes, threshold } = proposal

  const totalStaked = useAccountTotalStaked()

  const myStake = useMemo(
    () =>
      stakes.find(({ entity }) => addressesEqual(entity, connectedAccount)) || {
        amount: new BigNumber('0'),
      },
    [stakes, connectedAccount]
  )

  const nonStakedTokens = useMemo(
    () => accountBalance.minus(totalStaked).plus(myStake.amount),
    [myStake.amount, accountBalance, totalStaked]
  )

  const myStakeAmountFormatted = formatTokenAmount(
    myStake.amount,
    stakeToken.decimals
  )

  const formattedMaxAvailableAmount = useMemo(() => {
    if (!stakeToken) {
      return '0'
    }
    return formatTokenAmount(nonStakedTokens, stakeToken.decimals)
  }, [stakeToken, nonStakedTokens])

  const rounding = Math.min(MAX_INPUT_DECIMAL_BASE, stakeToken.decimals)

  const [
    { value: inputValue, max: maxAvailable, progress },
    setAmount,
    setProgress,
  ] = useAmount(
    myStakeAmountFormatted.replace(',', ''),
    formattedMaxAvailableAmount.replace(',', ''),
    rounding
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

  const handleChangeSupport = useCallback(() => {
    const newValue = new BigNumber(toDecimals(inputValue, stakeToken.decimals))

    if (newValue.lt(myStake.amount)) {
      onWithdrawFromProposal(id, myStake.amount.minus(newValue).toString(10))
      return
    }

    onStakeToProposal(id, newValue.minus(myStake.amount).toString(10))
  }, [
    id,
    inputValue,
    myStake.amount,
    stakeToken.decimals,
    onStakeToProposal,
    onWithdrawFromProposal,
  ])

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
        action: handleChangeSupport,
        mode: 'normal',
        disabled:
          myStakeAmountFormatted.replace(',', '') === inputValue.toString(),
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
    handleChangeSupport,
    inputValue,
    mode,
    myStakeAmountFormatted,
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
              value={progress}
              onUpdate={setProgress}
              css={`
                padding-left: 0;
                width: 100%;
              `}
            />
            <TextInput
              value={inputValue}
              onChange={setAmount}
              type="number"
              max={maxAvailable}
              min="0"
              required
              css={`
                width: ${18 * GU}px;
              `}
            />
          </div>
        </Field>
      )}
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

const useAmount = (balance, maxAvailable, rounding) => {
  const [amount, setAmount] = useState({
    value: balance, // TODO: Use BNs
    max: maxAvailable,
    progress: safeDiv(balance, maxAvailable),
  })

  useEffect(() => {
    setAmount(prevState => {
      if (prevState.max === maxAvailable) {
        return prevState
      }
      const newValue = round(prevState.progress * maxAvailable, rounding)

      return {
        ...prevState,
        value: String(newValue),
        max: maxAvailable,
      }
    })
  }, [maxAvailable, rounding])

  useEffect(() => {
    setAmount(prevState => {
      if (prevState.value === balance) {
        return prevState
      }

      return {
        ...prevState,
        value: balance,
        progress: safeDiv(balance, maxAvailable),
      }
    })
  }, [balance, maxAvailable])

  const handleAmountChange = useCallback(
    event => {
      const newValue = Math.min(event.target.value, maxAvailable)
      const newProgress = safeDiv(newValue, maxAvailable)

      setAmount(prevState => ({
        ...prevState,
        value: String(newValue),
        progress: newProgress,
      }))
    },
    [maxAvailable]
  )

  const handleSliderChange = useCallback(
    newProgress => {
      const newValue =
        newProgress === 1
          ? round(Number(maxAvailable), rounding)
          : round(newProgress * maxAvailable, 2)

      setAmount(prevState => ({
        ...prevState,
        value: String(newValue),
        progress: newProgress,
      }))
    },
    [maxAvailable, rounding]
  )

  return [amount, handleAmountChange, handleSliderChange]
}

export default ProposalActions
