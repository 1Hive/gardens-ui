import React from 'react'
import { GU, LoadingRing, textStyle, useTheme } from '@1hive/1hive-ui'

import HeaderModule from './Header/HeaderModule'
import useAccountTokens from '@hooks/useAccountTokens'
import { useGardenState } from '@providers/GardenState'
import { useWallet } from '@providers/Wallet'

import { formatTokenAmount } from '@utils/token-utils'
import { safeDivBN } from '@utils/math-utils'
import defaultTokenLogo from '@assets/defaultTokenLogo.svg'

function BalanceModule() {
  const theme = useTheme()
  const wallet = useWallet()
  const { token } = useGardenState()

  const { inactiveTokens } = useAccountTokens(
    wallet.account,
    token.accountBalance
  )

  const inactivePct = safeDivBN(
    inactiveTokens.times('100'),
    token.accountBalance
  ).toString()

  return (
    <HeaderModule
      icon={
        <img
          src={token.data.logo || defaultTokenLogo}
          height="28"
          width="28"
          alt=""
        />
      }
      content={
        <div>
          <div
            css={`
              margin-bottom: -2px;
              ${textStyle('body4')};
              color: ${theme.contentSecondary};
            `}
          >
            Balance
          </div>
          <div
            css={`
              display: flex;
              align-items: center;
            `}
          >
            <div
              css={`
                margin-right: ${0.5 * GU}px;
              `}
            >
              {token.accountBalance.eq(-1) ? (
                <LoadingRing />
              ) : (
                <span>
                  {formatTokenAmount(token.accountBalance, token.data.decimals)}
                </span>
              )}
            </div>
            <span
              css={`
                color: ${theme.contentSecondary};
              `}
            >
              ({parseFloat(inactivePct).toFixed(2)}% idle)
            </span>
          </div>
        </div>
      }
      hasPopover={false}
    />
  )
}

export default BalanceModule
