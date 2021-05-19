import React from 'react'
import { Box, GU, textStyle, useLayout, useTheme } from '@1hive/1hive-ui'

import { useGardens } from '../providers/Gardens'
import { useUniswapHnyPrice } from '../hooks/useUniswapHNYPrice'
import { formatDecimals, formatTokenAmount } from '../utils/token-utils'

import defaultTokenSvg from '../assets/defaultToken.svg'

const Metrics = React.memo(function Metrics({
  commonPool,
  onExecuteIssuance,
  totalActiveTokens,
  totalSupply,
}) {
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'
  const {
    connectedGarden: { wrappableToken, token },
  } = useGardens()
  const currency = {
    name: 'USD',
    symbol: '$',
    rate: 1,
  }

  const metricsToken = wrappableToken || token

  return (
    <Box padding={3 * GU}>
      <div
        css={`
          display: flex;
          justify-content: space-around;
        `}
      >
        <div
          css={`
            display: flex;
            align-items: center;
            margin-bottom: ${(compactMode ? 2 : 0) * GU}px;
          `}
        >
          <img
            src={metricsToken.logo || defaultTokenSvg}
            height="60"
            width="60"
            alt=""
            onClick={onExecuteIssuance}
            css={`
              margin-right: ${4 * GU}px;
              cursor: pointer;
            `}
          />
          <TokenPrice currency={currency} token={metricsToken} />
        </div>
        <div>
          <TokenBalance
            label="Common Pool"
            value={commonPool}
            token={metricsToken}
            currency={currency}
          />
        </div>
        <div>
          <TokenBalance
            label="Token Supply"
            value={totalSupply}
            token={metricsToken}
            currency={currency}
          />
        </div>
        <div>
          <TokenBalance
            label="Active"
            value={totalActiveTokens}
            token={metricsToken}
            currency={currency}
          />
        </div>
      </div>
    </Box>
  )
})

function Metric({ label, value, color }) {
  const theme = useTheme()

  return (
    <>
      <p
        css={`
          color: ${theme.contentSecondary};
          margin-bottom: ${0.5 * GU}px;
        `}
      >
        {label}
      </p>
      <span
        css={`
          ${textStyle('title2')};
          color: ${color || theme.content};
        `}
      >
        {value}
      </span>
    </>
  )
}

function TokenBalance({ label, token, value, currency }) {
  const theme = useTheme()
  const price = useUniswapHnyPrice()
  const currencyValue = value * price * currency.rate

  return (
    <>
      <Metric label={label} value={formatTokenAmount(value, token.decimals)} />
      <div
        css={`
          color: ${theme.green};
        `}
      >
        {currency.symbol} {formatTokenAmount(currencyValue, token.decimals)}
      </div>
    </>
  )
}

function TokenPrice({ currency, token }) {
  const theme = useTheme()
  const price = useUniswapHnyPrice() // TODO: Update to fetch token price

  return (
    <div>
      <p
        css={`
          ${textStyle('title2')};
          margin-bottom: ${0.5 * GU}px;
        `}
      >
        {token.symbol} Price
      </p>
      <span
        css={`
          ${textStyle('title2')};
          color: ${theme.green};
        `}
      >
        {currency.symbol}
        {formatDecimals(price * currency.rate, 2)}
      </span>
    </div>
  )
}

export default Metrics
