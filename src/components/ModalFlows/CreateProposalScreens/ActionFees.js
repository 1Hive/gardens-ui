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
          through the collateral manager. If the action is disputed and
          cancelled by Celeste the deposit will be lost.
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
          height: ${GU * 5}px;
          margin-top: ${!compactMode ? GU * 3 : 0}px;
        `}
      >
        {!compactMode && (
          <div
            css={`
              flex: 0.25;
              position: relative;
            `}
          >
            <img
              css={`
                height: ${GU * 4}px;
                width: ${GU * 4}px;
                position: absolute;
                bottom: 2px;
              `}
              src={iconFees}
              alt=""
            />
          </div>
        )}

        <div
          css={`
            flex: ${compactMode ? 1 : 2};
            padding: 0 0 0 ${!compactMode ? 1.25 * GU : 0}px;
            align-items: baseline;
            align-self: flex-end;
            height: 100%;
            position: relative;
          `}
        >
          <h3
            css={`
              font-weight: 600;
              position: absolute;
              bottom: 0;
            `}
          >
            Action Deposit
          </h3>
        </div>
        <div
          css={`
            flex: 0.5;
            align-items: baseline;
            align-self: flex-end;
            height: 100%;
            position: relative;
            ${compactMode ? textStyle('body4') : textStyle('body3')};
          `}
        >
          <div
            css={`
              text-align: 'left';
              font-weight: 600;
              position: absolute;
              bottom: 0;
              ${compactMode ? textStyle('body3') : textStyle('body2')};
            `}
          >
            ${dollarAmount}
          </div>
        </div>
        <div
          css={`
            flex: 0.65;
            align-items: baseline;
            align-self: flex-end;
            height: 100%;
            position: relative;
            ${compactMode ? textStyle('body4') : textStyle('body3')};
          `}
        >
          <div
            css={`
              margin-right: ${compactMode ? GU : 0}px;
              font-weight: 600;
              bottom: 0;
              position: absolute;
              ${compactMode ? textStyle('body3') : textStyle('body2')};
            `}
          >
            {formatedAmount} {token.symbol}
          </div>
        </div>
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
