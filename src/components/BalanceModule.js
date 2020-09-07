import React, { useCallback, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { GU, textStyle, useTheme } from '@1hive/1hive-ui'

import HeaderModule from './Header/HeaderModule'
import { useAppState } from '../providers/AppState'
import { useMyStakes } from '../hooks/useStakes'

import BigNumber from '../lib/bigNumber'
import { formatTokenAmount, getTokenIconBySymbol } from '../lib/token-utils'

function BalanceModule() {
  const theme = useTheme()
  const { history } = useHistory()
  const { accountBalance, stakeToken } = useAppState()
  const tokenIcon = getTokenIconBySymbol('HNY' || stakeToken.symbol) // TODO: remove

  const myStakes = useMyStakes()

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

  const handleOnClick = useCallback(() => history.push('/profile'), [history])

  const idlePct = inactiveTokens.eq('0')
    ? '0'
    : inactiveTokens
        .times('100')
        .div(accountBalance)
        .toString()

  return (
    <HeaderModule
      icon={<img src={tokenIcon} height="28" width="28" alt="" />}
      content={
        <div
          css={`
            min-width: ${20 * GU}px;
          `}
        >
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
              {formatTokenAmount(myActiveTokens, stakeToken.decimals)}
            </span>{' '}
            <span
              css={`
                color: ${theme.contentSecondary};
              `}
            >
              ({idlePct}% idle)
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
