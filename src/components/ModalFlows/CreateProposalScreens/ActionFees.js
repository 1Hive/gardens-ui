import React, { useCallback } from 'react'
import { Button, Field, GU, textStyle, theme, useLayout } from '@1hive/1hive-ui'
import { useUniswapHnyPrice } from '../../../hooks/useUniswapHNYPrice'
import { useMultiModal } from '../../MultiModal/MultiModalProvider'
import { getDisputableAppByName } from '../../../utils/app-utils'
import { formatTokenAmount } from '../../../utils/token-utils'
import iconFees from '../../../assets/iconFees.svg'

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
            ${textStyle('body2')};
          `}
        >
          A deposit is required for your action to be submitted which will be
          held until the action is finalised. If the action is withdrawn by you
          or completed successfully the deposit will be unlocked, available
          through the staking manager. If the action is disputed and cancelled
          by Celeste the deposit will be lost.
        </span>
      </Field>

      {compactMode && (
        <div
          css={`
            margin-top: ${GU * 2}px;
            weight: 100%;
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
        </div>
      )}

      <div
        css={`
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          width: 100%;
          margin-top: ${(compactMode ? 0 : 3) * GU}px;
        `}
      >
        {!compactMode && (
          <div
            css={`
              flex: 0.25;
            `}
          >
            <img
              css={`
                height: ${GU * 4.5}px;
                width: ${GU * 4.5}px;
              `}
              src={iconFees}
              alt=""
            />
          </div>
        )}
        <div
          css={`
            flex: ${compactMode ? 1 : 2};
            align-self: center;
            padding: 0 0 0 ${!compactMode ? 2 * GU : 0}px;
          `}
        >
          <h3
            css={`
              font-weight: 600;
            `}
          >
            Action Deposit
          </h3>
        </div>
        <div
          css={`
            flex: 0.5;
            align-self: center;
            ${compactMode ? textStyle('body4') : textStyle('body3')};
          `}
        >
          <div
            css={`
              text-align: ${compactMode ? 'left' : 'right'};
              font-weight: 600;
              ${compactMode ? textStyle('body3') : textStyle('body2')}
            `}
          >
            ${dollarAmount}
          </div>
        </div>
        <div
          css={`
            flex: 0.65;
            align-self: center;
            ${compactMode ? textStyle('body4') : textStyle('body3')}
          `}
        >
          <div
            css={`
              text-align: right;
              margin-right: ${compactMode ? GU : 0}px;
              font-weight: 600;
              ${compactMode ? textStyle('body3') : textStyle('body2')};
            `}
          >
            {formatedAmount} {token.symbol}
          </div>
        </div>
      </div>
      <div
        css={`
          color: ${theme.contentSecondary};
          ${textStyle('body4')}
          margin-left: ${!compactMode ? GU * 7 : 0}px;
        `}
      >
        withdrawn from your staking manager balance.
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
