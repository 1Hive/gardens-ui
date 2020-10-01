import React, { useCallback, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { textStyle, useTheme } from '@1hive/1hive-ui'

import HeaderModule from './Header/HeaderModule'
import { useAppState } from '../providers/AppState'
import { useAccountStakes } from '../hooks/useStakes'
import { useWallet } from '../providers/Wallet'

import BigNumber from '../lib/bigNumber'
import { formatTokenAmount, getTokenIconBySymbol } from '../lib/token-utils'

function BalanceModule() {
  const theme = useTheme()
  const wallet = useWallet()
  const history = useHistory()
  const { accountBalance, stakeToken } = useAppState()
  const tokenIcon = getTokenIconBySymbol(stakeToken.symbol)

  const myStakes = useAccountStakes(wallet.account)

  const myActiveTokens = useMemo(() => {
    if (!myStakes) {
      return new BigNumber('0')
    }
    return myStakes.reduce((accumulator, stake) => {
      return accumulator.plus(stake.amount)
    }, new BigNumber('0'))
  }, [myStakes])

  const inactiveTokens = useMemo(() => {
    if (!accountBalance.gte(0) || !myActiveTokens) {
      return new BigNumber('0')
    }
    return accountBalance.minus(myActiveTokens)
  }, [accountBalance, myActiveTokens])

  const handleOnClick = useCallback(() => history.push('/profile'), [history]) // TODO: Send to profile/stake management section

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
          <div>
            <span>
              {formatTokenAmount(accountBalance, stakeToken.decimals)}
            </span>{' '}
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
