import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, ButtonBase, GU, Field, Info, TextInput } from '@1hive/1hive-ui'

import useAccountTotalStaked from '@hooks/useAccountTotalStaked'
import { useGardenState } from '@providers/GardenState'
import { useMultiModal } from '@components/MultiModal/MultiModalProvider'
import { useWallet } from '@providers/Wallet'

import { formatTokenAmount } from '@utils/token-utils'
import { addressesEqual } from '@utils/web3-utils'

import { fromDecimals, pct, round, toDecimals } from '@utils/math-utils'
import BigNumber from '@lib/bigNumber'

// TODO - leaving this screen instead of doing the support and the change support in the same screen just in case fiore wants to change something
const ChangeSupport = React.memo(function ChangeSupport({
  proposal,
  getTransactions,
}) {
  const { account } = useWallet()
  const { config, token } = useGardenState()
  const { stakeToken } = config.conviction
  const { next } = useMultiModal()

  const [amount, setAmount] = useState({
    value: '0',
    valueBN: new BigNumber('0'),
  })

  const { stakes } = proposal

  const totalStaked = useAccountTotalStaked(account)

  const myStake = useMemo(
    () =>
      stakes.find(({ supporter }) =>
        addressesEqual(supporter.user.address, account)
      ) || {
        amount: new BigNumber('0'),
      },
    [stakes, account]
  )

  const maxAvailable = useMemo(
    () => token.accountBalance.minus(totalStaked).plus(myStake.amount),
    [myStake.amount, token.accountBalance, totalStaked]
  )

  const totalStakedOnOthers = totalStaked - myStake.amount

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
  const maxStakedPct = round(pct(maxAvailable, token.accountBalance))
  const stakedOthersPct = round(pct(totalStakedOnOthers, token.accountBalance))

  return (
    <form onSubmit={handleSubmit}>
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
                color: #30db9e;
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
        You are currently supporting this proposal with{' '}
        <strong>
          {formatTokenAmount(myStake.amount, stakeToken.decimals)}{' '}
          {stakeToken.symbol}
        </strong>
        . You have up to{' '}
        <strong>
          {formatTokenAmount(maxAvailable, stakeToken.decimals)}{' '}
          {stakeToken.symbol}
        </strong>{' '}
        ({maxStakedPct}% of your balance) available to support this proposal.{' '}
        {
          <span>
            You are supporting other proposals with{' '}
            <strong>
              {formatTokenAmount(totalStakedOnOthers, stakeToken.decimals)}{' '}
              {stakeToken.symbol}
            </strong>{' '}
            ({stakedOthersPct}% of your balance).
          </span>
        }
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
