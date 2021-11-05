import React, { useCallback } from 'react'
import { Button, Field, GU, textStyle, theme, useLayout } from '@1hive/1hive-ui'
import { useHoneyswapTokenPrice } from '@hooks/useHoneyswapTokenPrice'
import { useMultiModal } from '@components/MultiModal/MultiModalProvider'

import env from '@/environment'
import { formatTokenAmount } from '@utils/token-utils'
import { getDisputableAppByName } from '@utils/app-utils'

import iconFees from '@assets/iconFees.svg'

function ActionFeesModal({ agreement, onCreateTransaction }) {
  const { next } = useMultiModal()
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'

  const convictionAppRequirements = getDisputableAppByName(
    agreement.disputableAppsWithRequirements,
    env('CONVICTION_APP_NAME')
  )

  const { actionAmount, token } = convictionAppRequirements
  const tokenPrice = useHoneyswapTokenPrice(token.id)

  const formattedAmount = formatTokenAmount(actionAmount, token.decimals)
  const dollarAmount =
    tokenPrice > 0
      ? formatTokenAmount(actionAmount * tokenPrice, token.decimals)
      : '-'

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
          A small deposit is required for your proposal to be submitted. This
          will be held until the proposal is finalised. If the proposal is
          withdrawn by you or completed successfully your deposit will be
          unlocked, and made available to you through the deposit manager. If
          your proposal is disputed and cancelled by Celeste, your deposit will
          be lost.
        </span>
      </Field>

      <div
        css={`
          display: flex;
          width: 100%;
          height: ${4 * GU}px;
          margin-top: ${!compactMode ? 3 * GU : 0}px;
          align-items: center;
          justify-content: space-between;
        `}
      >
        <div
          css={`
            display: flex;
            align-items: center;
          `}
        >
          <img src={iconFees} alt="" height={4 * GU} width={4 * GU} />
          <h3
            css={`
              font-weight: 600;
              margin-left: ${GU}px;
            `}
          >
            Proposal Deposit
          </h3>
        </div>
        <div>
          <span
            css={`
              text-align: left;
              font-weight: 600;
              ${compactMode ? textStyle('body3') : textStyle('body2')};
              margin-right: ${(compactMode ? 1.5 : 3) * GU}px;
            `}
          >
            ${dollarAmount}
          </span>

          <span
            css={`
              font-weight: 600;
              ${compactMode ? textStyle('body3') : textStyle('body2')};
            `}
          >
            {formattedAmount} {token.symbol}
          </span>
        </div>
      </div>
      <Button
        label="Deposit and create proposal"
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
