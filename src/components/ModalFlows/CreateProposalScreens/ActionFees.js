import React, { useCallback } from 'react'
import { Button, Field, GU, textStyle, theme, useLayout } from '@1hive/1hive-ui'
import iconFees from '../../../assets/iconFees.svg'
import { getDisputableAppByName } from '../../../utils/app-utils'
import { formatTokenAmount } from '../../../utils/token-utils'
import { useUniswapHnyPrice } from '../../../hooks/useUniswapHNYPrice'
import { useMultiModal } from '../../MultiModal/MultiModalProvider'

function ActionFeesModal({ agreement, onCreateTransaction }) {
  const tokenRate = useUniswapHnyPrice()
  const { next } = useMultiModal()
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'

  const convictionAppRequirements = getDisputableAppByName(
    agreement.disputableAppsWithRequirements,
    'Conviction Voting'
  )

  const { actionAmount, token } = convictionAppRequirements

  const formatedAmount = formatTokenAmount(actionAmount, token.decimals)
  const dollarAmount = formatTokenAmount(
    actionAmount * tokenRate,
    token.decimals
  )

  const handleOnCreateTransaction = useCallback(() => {
    onCreateTransaction(() => {
      next()
    })
  }, [onCreateTransaction, next])

  return (
    <div>
      <Field
        css={`
          color: ${theme.surfaceContentSecondary};
        `}
      >
        <span
          css={`
            ${compactMode ? textStyle('body3') : textStyle('body2')};
          `}
        >
          A deposit is required for your action to be submitted which will be
          held until the action is finalised. If the action is withdrawn by you
          or completed successfully the deposit will be unlocked, available
          through the staking manager. If the action is disputed and cancelled
          by Celeste the deposit will be lost.
        </span>
      </Field>

      <div
        css={`
          display: flex;
          width: 100%;
          height: ${GU * 4}px;
          margin-top: ${!compactMode ? GU * 3 : 0}px;
          align-items: center;
        `}
      >
        <img
          css={`
            height: ${GU * 4}px;
            width: ${GU * 4}px;
          `}
          src={iconFees}
          alt=""
        />

        <h3
          css={`
            font-weight: 600;
            margin-left: 3%;
          `}
        >
          Action Deposit
        </h3>

        <span
          css={`
            text-align: 'left';
            font-weight: 600;
            position: absolute;
            right: ${compactMode ? GU * 13.1 : GU * 19}px;
            ${compactMode ? textStyle('body3') : textStyle('body2')};
          `}
        >
          ${dollarAmount}
        </span>

        <span
          css={`
            margin-right: ${compactMode ? GU : 0}px;
            font-weight: 600;
            position: absolute;
            right: ${compactMode ? GU * 4 : GU * 6.25}px;
            ${compactMode ? textStyle('body3') : textStyle('body2')};
          `}
        >
          {formatedAmount} {token.symbol}
        </span>
      </div>
      <Button
        label="Create transaction"
        mode="strong"
        onClick={handleOnCreateTransaction}
        css={`
          margin-top: ${3.125 * GU}px;
          width: 100%;
        `}
      />
    </div>
  )
}

export default ActionFeesModal
