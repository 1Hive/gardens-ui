import React, { useCallback } from 'react'
import { Button, Field, GU, textStyle, theme } from '@1hive/1hive-ui'
import iconFees from '../../../assets/iconFees.svg'
import { getNetwork } from '../../../networks'
import { getDisputableAppByName } from '../../../utils/app-utils'
import { formatTokenAmount } from '../../../utils/token-utils'
import { useUniswapHnyPrice } from '../../../hooks/useUniswapHNYPrice'
import { useMultiModal } from '../../MultiModal/MultiModalProvider'

function ActionFeesModal({ agreement, onCreateTransaction }) {
  const networkName = getNetwork().name
  const tokenRate = useUniswapHnyPrice()
  const { next } = useMultiModal()

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
        label="Transaction fees"
        css={`
          color: ${theme.surfaceContentSecondary};
        `}
      >
        <span
          css={`
            ${textStyle('body2')}
          `}
        >
          Fees are required for your action to be submitted and the transaction
          to be processed. Part of them will go to the {networkName} network and
          the other part to 1Hive Protocol, in compensation for dispute
          resolution services.
        </span>
      </Field>
      <div
        css={`
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          width: 100%;
          margin-top: ${GU * 3}px;
        `}
      >
        <div
          css={`
            flex: 0.25;
          `}
        >
          <img src={iconFees} alt="" />
        </div>
        <div
          css={`
            flex: 2;
            align-self: center;
            padding: 0 0 0 ${2 * GU}px;
          `}
        >
          <h3
            css={`
              font-weight: 600;
            `}
          >
            Estimated fees
          </h3>
          <div
            css={`
              text-align: left;
              ${textStyle('body3')}
            `}
          >
            {networkName} network (withdraw from wallet balance)
          </div>
          <div
            css={`
              text-align: left;
              ${textStyle('body3')}
            `}
          >
            Action fee (withdraw from your staking balance)
          </div>
        </div>
        <div
          css={`
            flex: 0.5;
            align-self: center;
          `}
        >
          <div
            css={`
              text-align: right;
              font-weight: 600;
            `}
          >
            ${dollarAmount}
          </div>
          <div
            css={`
              text-align: right;
            `}
          >
            -
          </div>
          <div
            css={`
              text-align: right;
            `}
          >
            ${dollarAmount}
          </div>
        </div>
        <div
          css={`
            flex: 0.65;
            align-self: center;
          `}
        >
          <div
            css={`
              text-align: right;
              height: ${3 * GU}px;
              margin-right: ${GU}px;
              font-weight: 600;
            `}
          >
            {formatedAmount} {token.symbol}
          </div>
          <div
            css={`
              text-align: right;
              height: ${3 * GU}px;
              margin-right: ${GU}px;
            `}
          >
            -
          </div>
          <div
            css={`
              text-align: right;
              height: ${3 * GU}px;
              margin-right: ${GU}px;
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
