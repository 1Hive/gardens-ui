import React from 'react'
import { Box, GU, textStyle, useLayout, useTheme } from '@1hive/1hive-ui'

import { useHoneyswapTokenPrice } from '@hooks/useHoneyswapTokenPrice'
import { formatDecimals, formatTokenAmount } from '@utils/token-utils'

import defaultTokenLogo from '@assets/defaultTokenLogo.svg'

const Metrics = React.memo(function Metrics({
  commonPool,
  onExecuteIssuance,
  token,
  totalActiveTokens,
  totalSupply,
}) {
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'
  const currency = {
    name: 'USD',
    symbol: '$',
    rate: 1,
  }

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
            src={token.logo || defaultTokenLogo}
            height="60"
            width="60"
            alt=""
            onClick={onExecuteIssuance}
            css={`
              margin-right: ${4 * GU}px;
              cursor: pointer;
            `}
          />
          <TokenPrice currency={currency} token={token} />
        </div>
        <div>
          <TokenBalance
            label="Common Pool"
            value={commonPool}
            token={token}
            currency={currency}
          />
        </div>
        <div>
          <TokenBalance
            label="Token Supply"
            value={totalSupply}
            token={token}
            currency={currency}
          />
        </div>
        <div>
          <TokenBalance
            label="Active"
            value={totalActiveTokens}
            token={token}
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
  const price = useHoneyswapTokenPrice(token.id)
  const currencyValue = value * price * currency.rate

  return (
    <>
      <Metric label={label} value={formatTokenAmount(value, token.decimals)} />
      <div
        css={`
          color: ${theme.green};
        `}
      >
        {price >= 0 ? (
          <span>
            {currency.symbol} {formatTokenAmount(currencyValue, token.decimals)}
          </span>
        ) : (
          <span>-</span>
        )}
      </div>
    </>
  )
}

function TokenPrice({ currency, token }) {
  const theme = useTheme()
  const price = useHoneyswapTokenPrice(token.id)

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
        {price > 0 ? (
          <span>
            {currency.symbol}
            {formatDecimals(price * currency.rate, 2)}
          </span>
        ) : (
          <span>-</span>
        )}
      </span>
    </div>
  )
}

export default Metrics
