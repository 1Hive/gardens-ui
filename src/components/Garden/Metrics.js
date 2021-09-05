import React from 'react'
import { Box, GU, textStyle, useLayout, useTheme } from '@1hive/1hive-ui'
import HelpTip from '@components/HelpTip'
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
        {layoutName !== 'medium' && (
          <div
            css={`
              display: flex;
              align-items: center;
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
        )}
        <div>
          <TokenBalance
            label="Common Pool"
            value={commonPool}
            token={token}
            currency={currency}
            helptip="common-pool"
          />
        </div>
        <div>
          <TokenBalance
            label="Total Supply"
            value={totalSupply}
            token={token}
            currency={currency}
            helptip="total-supply"
          />
        </div>
        <div>
          <TokenBalance
            label="Active Supply"
            value={totalActiveTokens}
            token={token}
            currency={currency}
            helptip="active-supply"
          />
        </div>
      </div>
    </Box>
  )
})

function Metric({ label, value, color, helptip }) {
  const theme = useTheme()

  return (
    <>
      <div
        css={`
          color: ${theme.contentSecondary};
          margin-bottom: ${0.5 * GU}px;
        `}
      >
        {label}
        <span
          css={`
            padding-left: ${1 * GU}px;
            display: inline-block;
          `}
        >
          <HelpTip type={helptip} />
        </span>
      </div>
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

function TokenBalance({ label, token, value, currency, helptip }) {
  const theme = useTheme()
  const price = useHoneyswapTokenPrice(token.id)
  const currencyValue = value * price * currency.rate

  return (
    <>
      <Metric
        label={label}
        value={formatTokenAmount(value, token.decimals)}
        helptip={helptip}
      />
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
