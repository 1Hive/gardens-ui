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
import { toDecimals } from '../../../utils/math-utils'
import { formatTokenAmount } from '../../../utils/token-utils'
import { useMultiModal } from '../../MultiModal/MultiModalProvider'

const DEFAULT_AMOUNT_DATA = {
  value: '0',
  valueBN: new BigNumber(0),
}

function StakeAndWithdraw({
  accountBalance,
  mode,
  stakeManagement,
  getTransactions,
}) {
  const [amountData, setAmountData] = useState(DEFAULT_AMOUNT_DATA)
  const [error, setError] = useState(null)
  const theme = useTheme()
  const { next } = useMultiModal()
  const { symbol, decimals } = stakeManagement.token
  const depositMode = mode === 'deposit'

  const handleAmountChange = useCallback(
    event => {
      const amount = event.target.value
      const amountBN = new BigNumber(toDecimals(amount, decimals))
      setAmountData(amountData => ({
        ...amountData,
        value: amount,
        valueBN: amountBN,
      }))

      if (depositMode) {
        if (amountBN.gt(accountBalance)) {
          setError('Yo have insufficient funds in your connected account. ')
          return
        }
        setError(null)
        return
      }
      if (amountBN.gt(stakeManagement.staking.available.toString())) {
        setError('Yo have insufficient funds in your account.')
      }
    },
    [accountBalance, decimals, depositMode, stakeManagement.staking.available]
  )

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

      getTransactions(() => {
        next()
      }, amountData.valueBN)
    },
    [amountData.valueBN, getTransactions, next]
  )

  const textData = useMemo(() => {
    if (depositMode) {
      return {
        descriptionText: `This amount will be locked in the collateral manager and will be used as collateral when creating actions bound by this organization's Covenant.`,
        balanceText: `Your account balance is ${formatTokenAmount(
          accountBalance,
          decimals
        )} ${symbol}`,
        buttonText: 'Deposit',
      }
    }
    return {
      descriptionText: `This amount will be withdrawn from your available balance and directly credited to your enabled account.`,
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
          {error && (
            <span
              css={`
                color: ${theme.error};
              `}
            >
              {error}
            </span>
          )}
          {textData.balanceText}
        </div>
        {depositMode && (
          <Info
            css={`
              margin-top: ${2 * GU}px;
            `}
          >
            You will be able to withdraw your collateral balance at any time,
            except for any that is locked on a scheduled proposal.
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
          disabled={error}
        />
      </form>
    </>
  )
}

export default StakeAndWithdraw
