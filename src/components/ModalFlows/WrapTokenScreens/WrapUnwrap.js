import React, { useCallback, useMemo, useState } from 'react'
import BigNumber from '../../../lib/bigNumber'
import {
  Button,
  ButtonBase,
  Field,
  GU,
  Info,
  TextInput,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'
import useAccountTotalStaked from '../../../hooks/useAccountTotalStaked'
import { useAppState } from '../../../providers/AppState'
import { useWallet } from '../../../providers/Wallet'
import { useMultiModal } from '../../MultiModal/MultiModalProvider'

import { toDecimals } from '../../../utils/math-utils'
import { formatTokenAmount } from '../../../utils/token-utils'

const WrapUnwrap = React.memo(function WrapUnwrap({ mode, getTransactions }) {
  const theme = useTheme()
  const [amount, setAmount] = useState({
    value: '0',
    valueBN: new BigNumber('0'),
  })

  const { account } = useWallet()
  const { accountBalance, stakeToken } = useAppState()
  const { next } = useMultiModal()

  const totalStaked = useAccountTotalStaked(account)
  const nonStakedTokens = accountBalance.minus(totalStaked)

  const handleEditMode = useCallback(
    editMode => {
      setAmount(amount => {
        const newValue = amount.valueBN.gte(0)
          ? formatTokenAmount(
              amount.valueBN,
              stakeToken.decimals,
              false,
              false,
              {
                commas: !editMode,
                replaceZeroBy: editMode ? '' : '0',
                rounding: stakeToken.decimals,
              }
            )
          : ''

        return {
          ...amount,
          value: newValue,
        }
      })
    },
    [stakeToken]
  )

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
      valueBN: nonStakedTokens,
      value: formatTokenAmount(
        nonStakedTokens,
        stakeToken.decimals,
        false,
        false,
        { commas: false, rounding: stakeToken.decimals }
      ),
    })
  }, [nonStakedTokens, stakeToken])

  // Form submit handler
  const handleSubmit = useCallback(
    event => {
      event.preventDefault()

      getTransactions(() => {
        next()
      }, amount.valueBN.toString(10))
    },
    [amount, getTransactions, next]
  )

  const errorMessage = useMemo(() => {
    if (amount.valueBN.eq(new BigNumber(-1))) {
      return 'Invalid amount'
    }

    if (amount.valueBN.gt(nonStakedTokens)) {
      return 'Insufficient balance'
    }

    return null
  }, [amount, nonStakedTokens])

  return (
    <form onSubmit={handleSubmit}>
      <span
        css={`
          ${textStyle('body2')};
        `}
      >
        {mode === 'wrap'
          ? 'The amount you wrap will be available to stake and vote on proposals'
          : 'If you unwrap your tokens you will lose your voting power. Any stake on suggestions or funding proposals will be removed when unwrapping.'}
      </span>
      <Field
        label="amount"
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        <TextInput
          value={amount.value}
          onChange={handleAmountChange}
          onFocus={() => handleEditMode(true)}
          onBlur={() => handleEditMode(false)}
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
      <Button
        label="Support this proposal"
        wide
        type="submit"
        mode="strong"
        disabled={amount.valueBN.eq(new BigNumber(0)) || Boolean(errorMessage)}
      />
      <span
        css={`
          ${textStyle('body3')};
          color: ${theme.contentSecondary};
        `}
      >
        Your account balance has
      </span>
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
    </form>
  )
})

export default WrapUnwrap
