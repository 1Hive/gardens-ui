import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { GU, LoadingRing, textStyle, useTheme } from '@1hive/1hive-ui'

import HeaderModule from './Header/HeaderModule'
import useAccountTokens from '../hooks/useAccountTokens'
import { useAppState } from '../providers/AppState'
import { useWallet } from '../providers/Wallet'

import { formatTokenAmount, getTokenIconBySymbol } from '../utils/token-utils'

function BalanceModule() {
  const theme = useTheme()
  const wallet = useWallet()
  const history = useHistory()
  const { accountBalance, stakeToken } = useAppState()
  const tokenIcon = getTokenIconBySymbol(stakeToken.symbol)

  const { inactiveTokens } = useAccountTokens(wallet.account, accountBalance)

  const handleOnClick = useCallback(() => history.push('/collateral'), [
    history,
  ])

  const inactivePct = inactiveTokens.eq('0')
    ? '0'
    : inactiveTokens
        .times('100')
        .div(accountBalance)
        .toString()

  return (
    <HeaderModule
      icon={<img src={tokenIcon} height="28" width="28" alt="" />}
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
              {accountBalance.eq(-1) ? (
                <LoadingRing />
              ) : (
                <span>
                  {formatTokenAmount(accountBalance, stakeToken.decimals)}
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
      onClick={handleOnClick}
    />
  )
}

export default BalanceModule
