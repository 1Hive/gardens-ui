import React, { useCallback, useMemo, useState } from 'react'
import { Button, GU, Info, Slider, textStyle, useTheme } from '@1hive/1hive-ui'

import useAccountTotalStaked from '../../../hooks/useAccountTotalStaked'
import { useAppState } from '../../../providers/AppState'
import { useMultiModal } from '../../MultiModal/MultiModalProvider'
import { useWallet } from '../../../providers/Wallet'

import { formatTokenAmount } from '../../../utils/token-utils'

import { fromDecimals, round, pct } from '../../../utils/math-utils'
import BigNumber from '../../../lib/bigNumber'

import honeySvg from '../../../assets/honey.svg'

const ChangeSupport = React.memo(function SupportProposal({
  id,
  getTransactions,
}) {
  const theme = useTheme()

  const { account } = useWallet()
  const { accountBalance, stakeToken } = useAppState()
  const { next } = useMultiModal()

  const totalStaked = useAccountTotalStaked(account)
  const nonStakedTokens = accountBalance.minus(totalStaked)

  const myStake = useMemo(() => {
    return totalStaked > 0 ? totalStaked.div(accountBalance).toNumber() : 0
  }, [totalStaked, accountBalance])

  const [slideValue, amount, handleSliderChange] = useAmount(
    myStake,
    stakeToken,
    accountBalance
  )

  // Form submit handler
  const handleSubmit = useCallback(
    event => {
      event.preventDefault()

      getTransactions(
        () => {
          next()
        },
        id,
        amount.toString(10)
      )
    },
    [amount, id, getTransactions, next]
  )

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
      <h5
        css={`
          ${textStyle('body4')}
          color: ${theme.surfaceContentSecondary};
          margin-top: ${GU * 3.75}px;
        `}
      >
        AMOUNT OF YOUR TOKENS FOR THIS PROPOSAL
      </h5>
      <div
        css={`
          display: flex;
          align-items: center;
          margin-top: ${GU * 2.5}px;
          margin-bottom: ${GU * 2.5}px;
        `}
      >
        <img
          src={honeySvg}
          height="30"
          width="30"
          alt=""
          css={`
            margin-right: ${0.7 * GU}px;
            cursor: pointer;
          `}
        />
        <span
          css={`
            ${textStyle('body3')}
            color: ${theme.surfaceContent};
          `}
        >
          HNY
        </span>
        <Slider
          css={`
            width: 100%;
            margin-left: ${2 * GU}px;
          `}
          value={slideValue}
          onUpdate={handleSliderChange}
        />
        <span
          css={`
            ${textStyle('body3')}
            width: ${GU * 19.5}px;
            color: ${theme.surfaceContent};
          `}
        >
          {round(slideValue * 100, 0)}%
          <span
            css={`
              ${textStyle('body4')}
              margin-left: ${GU * 0.5}px;;
              color: ${theme.surfaceContentSecondary};
            `}
          >
            ({formatTokenAmount(amount, stakeToken.decimals)}
            {''} HNY)
          </span>
        </span>
      </div>
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
        label="Support this proposal"
        wide
        type="submit"
        mode="strong"
      />
    </form>
  )
})

const useAmount = (myStake, stakeToken, maxAvailable) => {
  const [slideValue, setSlideValue] = useState(
    myStake &&
      fromDecimals(
        myStake
          .div(maxAvailable)
          .div(100)
          .toString(),
        stakeToken.decimals
      )
  )

  const [amount, setAmount] = useState(BigNumber(myStake))

  const handleSliderChange = useCallback(
    newProgress => {
      setSlideValue(newProgress)
      setAmount(BigNumber.sum(amount, maxAvailable.multipliedBy(newProgress)))
    },
    [maxAvailable]
  )

  return [slideValue, amount, handleSliderChange]
}

export default ChangeSupport
