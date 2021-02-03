import React, { useCallback, useMemo, useState } from 'react'
import {
  Button,
  Field,
  GU,
  Info,
  TextInput,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'
import BigNumber from '../../../lib/bigNumber'
import { formatTokenAmount } from '../../../utils/token-utils'

const DEFAULT_AMOUNT_DATA = {
  value: '0',
  valueBN: new BigNumber(0),
}

function StakeAndWithdraw({
  accountBalance,
  mode,
  stakeManagement,
  onDeposit,
  onWithdraw,
}) {
  const [amountData, setAmountData] = useState(DEFAULT_AMOUNT_DATA)
  const theme = useTheme()
  const { symbol, decimals } = stakeManagement.token
  const depositMode = mode === 'deposit'

  const handleAmountChange = useCallback(event => {
    const amount = event.target.value
    setAmountData(amountData => ({ ...amountData, amount: amount }))
  }, [])

  const handleMaxClick = useCallback(() => {
    const amount = {
      value: formatTokenAmount(
        depositMode ? accountBalance : stakeManagement.staking.available,
        decimals
      ),
      valueBN: depositMode ? accountBalance : stakeManagement.staking.available,
    }
    setAmountData(amount)
  }, [accountBalance, decimals, depositMode, stakeManagement.staking.available])

  const handleFormSubmit = useCallback(
    async event => {
      event.preventDefault()

      depositMode
        ? onDeposit(amountData.valueBN)
        : onWithdraw(amountData.valueBN)
    },
    [amountData.valueBN, depositMode, onDeposit, onWithdraw]
  )

  const textData = useMemo(() => {
    if (depositMode) {
      return {
        descriptionText: `This amount will be placed in the staking pool and will be used to pay
        for actions collateral and submission fees, when proposing actions
        bound by this organization's Agreement.`,
        balanceText: `Your account balance is ${formatTokenAmount(
          accountBalance,
          decimals
        )} ${symbol}`,
        buttonText: 'Deposit',
      }
    }
    return {
      descriptionText: `This amount will be withdrawn from your Available balance and directly credited to to your enabled account`,
      balanceText: `Your available balance is ${formatTokenAmount(
        stakeManagement.staking.available,
        decimals
      )} ${symbol}`,
      buttonText: 'Withdraw',
    }
  }, [
    accountBalance,
    depositMode,
    decimals,
    symbol,
    stakeManagement.staking.available,
  ])

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <span
          css={`
            ${textStyle('body2')}
          `}
        >
          {textData.descriptionText}
        </span>
        <Field
          label="amount"
          css={`
            margin-top: ${2 * GU}px;
            margin-bottom: ${1 * GU}px;
          `}
        >
          <TextInput
            value={amountData.value}
            onChange={handleAmountChange}
            required
            wide
            adornment={
              <span
                css={`
                  color: ${theme.link};
                  padding: 7px ${1.5 * GU}px;
                  cursor: pointer;
                `}
                onClick={handleMaxClick}
              >
                MAX
              </span>
            }
            adornmentPosition="end"
            adornmentSettings={{ padding: 1 }}
          />
        </Field>
        <div
          css={`
            text-align: left;
            ${textStyle('body3')};
            color: ${theme.contentSecondary};
          `}
        >
          {textData.balanceText}
        </div>
        {depositMode && (
          <Info
            css={`
              margin-top: ${2 * GU}px;
            `}
          >
            You will be able to withdraw your collateral balance any time,
            except when a portion of it is locked on a scheduled proposal
          </Info>
        )}
        <Button
          label={textData.buttonText}
          mode="strong"
          type="submit"
          css={`
            margin-top: ${2 * GU}px;
            width: 100%;
          `}
        />
      </form>
    </>
  )
}

export default StakeAndWithdraw
