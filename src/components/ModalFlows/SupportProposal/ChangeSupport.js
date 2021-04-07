import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Button,
  ButtonBase,
  GU,
  Field,
  Info,
  TextInput,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'

import useAccountTotalStaked from '../../../hooks/useAccountTotalStaked'
import { useAppState } from '../../../providers/AppState'
import { useMultiModal } from '../../MultiModal/MultiModalProvider'
import { useWallet } from '../../../providers/Wallet'

import { formatTokenAmount } from '../../../utils/token-utils'
import { addressesEqual } from '../../../utils/web3-utils'

import { fromDecimals, pct, round, toDecimals } from '../../../utils/math-utils'
import BigNumber from '../../../lib/bigNumber'

// TODO - leaving this screen instead of doing the support and the change support in the same screen just in case fiore wants to change something
const ChangeSupport = React.memo(function ChangeSupport({
  proposal,
  getTransactions,
}) {
  const theme = useTheme()

  const { account } = useWallet()
  const { accountBalance, stakeToken } = useAppState()
  const { next } = useMultiModal()

  const [amount, setAmount] = useState({
    value: '0',
    valueBN: new BigNumber('0'),
  })

  const { stakes } = proposal

  const totalStaked = useAccountTotalStaked(account)
  const nonStakedTokens = accountBalance.minus(totalStaked)

  const myStake = useMemo(
    () =>
      stakes.find(({ entity }) => addressesEqual(entity.id, account)) || {
        amount: new BigNumber('0'),
      },
    [stakes, account]
  )

  const maxAvailable = useMemo(
    () => accountBalance.minus(totalStaked).plus(myStake.amount),
    [myStake.amount, accountBalance, totalStaked]
  )

  useEffect(() => {
    if (myStake.amount) {
      setAmount({
        value: fromDecimals(myStake.amount.toString(), stakeToken.decimals),
        valueBN: myStake.amount,
      })
    }
  }, [myStake.amount, stakeToken.decimals])

  // Amount change handler
  const handleAmountChange = useCallback(
    event => {
      const newAmount = event.target.value.replace(/,/g, '.').replace(/-/g, '')

      const newAmountBN = new BigNumber(
        isNaN(event.target.value)
          ? -1
          : toDecimals(newAmount, stakeToken.decimals)
      )

      setAmount({
        value: newAmount,
        valueBN: newAmountBN,
      })
    },
    [stakeToken]
  )

  const handleMaxSelected = useCallback(() => {
    setAmount({
      valueBN: maxAvailable,
      value: formatTokenAmount(
        maxAvailable,
        stakeToken.decimals,
        false,
        false,
        { commas: false, rounding: stakeToken.decimals }
      ),
    })
  }, [maxAvailable, stakeToken])

  // Form submit handler
  const handleSubmit = useCallback(
    event => {
      event.preventDefault()

      if (amount.valueBN.lt(myStake.amount)) {
        getTransactions(
          () => {
            next()
          },
          'withdraw',
          myStake.amount
            .minus(amount.valueBN)
            .integerValue()
            .toString(10)
        )
        return
      }

      getTransactions(
        () => {
          next()
        },
        'stake',
        amount.valueBN
          .minus(myStake.amount)
          .integerValue()
          .toString(10)
      )
    },
    [amount, getTransactions, myStake.amount, next]
  )

  const errorMessage = useMemo(() => {
    if (amount.valueBN.eq(new BigNumber(-1))) {
      return 'Invalid amount'
    }

    if (amount.valueBN.gt(maxAvailable)) {
      return 'Insufficient balance'
    }

    return null
  }, [amount, maxAvailable])

  // Calculate percentages
  const nonStakedPct = round(pct(nonStakedTokens, accountBalance))
  const stakedPct = round(100 - nonStakedPct)

  return (
    <form onSubmit={handleSubmit}>
      <h3
        css={`
          ${textStyle('body3')}
        `}
      >
        This action will modify the amount of tokens locked with this proposal.
        The token weight backing the proposal will increase over time from 0 up
        to the max amount specified.
      </h3>
      <Field
        label="amount"
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        <TextInput
          value={amount.value}
          type="number"
          onChange={handleAmountChange}
          wide
          adornment={
            <ButtonBase
              css={`
                margin-right: ${1 * GU}px;
                color: ${theme.accent};
              `}
              onClick={handleMaxSelected}
            >
              MAX
            </ButtonBase>
          }
          adornmentPosition="end"
        />
      </Field>
      {errorMessage && (
        <Info
          mode="warning"
          css={`
            margin-top: ${2 * GU}px;
          `}
        >
          {errorMessage}
        </Info>
      )}
      <Info
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        You have{' '}
        <strong>
          {formatTokenAmount(nonStakedTokens, stakeToken.decimals)}{' '}
          {stakeToken.symbol}
        </strong>{' '}
        ({nonStakedPct}% of your balance) available to support this proposal.{' '}
        {totalStaked.gt(0) === false && (
          <span>
            You are supporting other proposals with{' '}
            <strong>
              {formatTokenAmount(totalStaked, stakeToken.decimals)} locked
            </strong>{' '}
            ({stakedPct}% of your balance).
          </span>
        )}
      </Info>
      <Button
        css={`
          margin-top: ${GU * 3}px;
        `}
        label={
          amount.value.toString() === '0'
            ? 'Withdraw support'
            : 'Change support'
        }
        wide
        type="submit"
        mode="strong"
        disabled={Boolean(errorMessage) || amount.valueBN.eq(myStake.amount)}
      />
    </form>
  )
})

export default ChangeSupport
