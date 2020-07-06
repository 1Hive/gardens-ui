import React, { useMemo } from 'react'
import {
  Box,
  EthIdenticon,
  GU,
  shortenAddress,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'
import styled from 'styled-components'
import { useAppState } from '../providers/AppState'
import { useWallet } from '../providers/Wallet'

import BigNumber from '../lib/bigNumber'
import { formatTokenAmount, getTokenIconBySymbol } from '../lib/token-utils'
import { useTokenBalanceToUsd } from '../hooks/useTokenPrice'

function Wallet({ myStakes }) {
  const theme = useTheme()
  const { account } = useWallet()
  const { accountBalance, stakeToken } = useAppState()

  const balanceUsdValue = useTokenBalanceToUsd(accountBalance, stakeToken)

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

  return (
    <Box padding={0}>
      <div
        css={`
          display: flex;
          align-items: center;
          padding: ${3 * GU}px;
          border-bottom: 1px solid ${theme.border};
        `}
      >
        <EthIdenticon
          address={account}
          radius={100}
          scale={1.7}
          css={`
            margin-right: ${1.5 * GU}px;
          `}
        />
        <span
          css={`
            ${textStyle('title4')}
          `}
        >
          {shortenAddress(account, 4)}
        </span>
      </div>
      <div
        css={`
          padding: ${3 * GU}px;
        `}
      >
        <h5
          css={`
            ${textStyle('title4')};
            color: ${theme.contentSecondary};
            margin-bottom: ${3 * GU}px;
          `}
        >
          Wallet
        </h5>
        <div>
          <Balance
            amount={accountBalance}
            decimals={stakeToken.decimals}
            label="Balance"
            symbol={stakeToken.symbol}
            value={balanceUsdValue}
          />
          <LineSeparator border={theme.border} />
          <Balance
            amount={inactiveTokens}
            decimals={stakeToken.decimals}
            inactive
            label="Inactive"
            symbol={stakeToken.symbol}
          />
        </div>
      </div>
    </Box>
  )
}

const Balance = ({
  amount,
  decimals,
  inactive = false,
  label,
  symbol,
  value,
}) => {
  const theme = useTheme()
  const tokenIcon = getTokenIconBySymbol(symbol)

  return (
    <div
      css={`
        display: flex;
        align-items: flex-start;
      `}
    >
      <div
        css={`
          margin-right: ${3 * GU}px;
        `}
      >
        <img
          src={tokenIcon}
          height="50"
          alt=""
          css={`
            opacity: ${inactive ? 0.5 : 1};
          `}
        />
      </div>
      <div>
        <h5
          css={`
            color: ${theme.contentSecondary};
          `}
        >
          {label}
        </h5>
        <span
          css={`
            ${textStyle('title4')};
            color: ${theme[inactive ? 'negative' : 'content']};
          `}
        >
          {formatTokenAmount(amount, decimals)}
        </span>
        {value && (
          <div
            css={`
              color: ${theme.green};
              ${textStyle('body3')}';
            `}
          >
            $ {value}
          </div>
        )}
      </div>
    </div>
  )
}

const LineSeparator = styled.div`
  height: 1px;
  border: 0.5px solid ${({ border }) => border};
  margin: ${3 * GU}px 0;
`

export default Wallet
