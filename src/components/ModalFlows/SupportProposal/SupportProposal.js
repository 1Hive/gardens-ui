import React, { useCallback, useState } from 'react'
import BigNumber from '../../../lib/bigNumber'
import { Button, GU, Info, Slider, textStyle, useTheme } from '@1hive/1hive-ui'
import useAccountTotalStaked from '../../../hooks/useAccountTotalStaked'
import { useAppState } from '../../../providers/AppState'
import { useWallet } from '../../../providers/Wallet'

import { round, pct } from '../../../utils/math-utils'

import honeySvg from '../../../assets/honey.svg'
// import { formatTokenAmount } from '../../../utils/token-utils'

const SupportProposal = React.memo(function SupportProposal({
  id,
  onDone,
  onStakeToProposal,
}) {
  const theme = useTheme()
  const [percentage, setPercentage] = useState({
    value: 0,
  })
  const [amount, setAmount] = useState({
    value: '0',
    valueBN: new BigNumber('0'),
  })

  const { account } = useWallet()
  const { accountBalance /* , stakeToken */ } = useAppState()

  const totalStaked = useAccountTotalStaked(account)
  const nonStakedTokens = accountBalance.minus(totalStaked)

  // const handleEditMode = useCallback(
  //   editMode => {
  //     setAmount(amount => {
  //       // const newValue = amount.valueBN.gte(0)
  //       //   ? formatTokenAmount(
  //       //       amount.valueBN,
  //       //       stakeToken.decimals,
  //       //       false,
  //       //       false,
  //       //       {
  //       //         commas: !editMode,
  //       //         replaceZeroBy: editMode ? '' : '0',
  //       //         rounding: stakeToken.decimals,
  //       //       }
  //       //     )
  //       //   : ''
  //       const newValue = ''

  //       return {
  //         ...amount,
  //         value: newValue,
  //       }
  //     })
  //   },
  //   [stakeToken]
  // )

  // Amount change handler
  const handleAmountChange = useCallback(
    event => {
      console.log(event)
      setPercentage(event)
      const newAmount = event

      const newAmountBN = event

      setAmount({
        value: newAmount,
        valueBN: newAmountBN,
      })
    },
    // [stakeToken]
    []
  )

  // Form submit handler
  const handleSubmit = useCallback(
    event => {
      event.preventDefault()

      onStakeToProposal(id, amount.valueBN.toString(10))

      onDone()
    },
    [amount, id, onDone, onStakeToProposal]
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
          value={percentage}
          onUpdate={handleAmountChange}
        />
        <span
          css={`
            ${textStyle('body3')}
            width: ${GU * 19.5}px;
            color: ${theme.surfaceContent};
          `}
        >
          50%
          <span
            css={`
              ${textStyle('body4')}
              margin-left: ${GU * 0.5}px;;
              color: ${theme.surfaceContentSecondary};
            `}
          >
            (380 HNY)
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
          {/* {formatTokenAmount(nonStakedTokens, stakeToken.decimals)}{' '} */}
          {/* {stakeToken.symbol} */}
          '760 HNY tokens'
        </strong>{' '}
        ({nonStakedPct}% of your balance) available to support this proposal.{' '}
        {totalStaked.gt(0) === false && (
          <span>
            You are supporting other proposals with{' '}
            <strong>
              {/* {formatTokenAmount(totalStaked, stakeToken.decimals)} locked */}
              tokens
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
        // disabled={amount.valueBN.eq(new BigNumber(0)) || Boolean(errorMessage)}
        disabled={false}
      />
    </form>
  )
})

export default SupportProposal
