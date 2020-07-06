import React from 'react'
import { Box, GU, Link, textStyle, useLayout, useTheme } from '@1hive/1hive-ui'
import { useTokenBalanceToUsd } from '../hooks/useTokenPrice'

import { bigNum } from '../lib/bigNumber'
import { formatTokenAmount } from '../lib/token-utils'
import honeySvg from '../assets/honey.svg'

const Metrics = React.memo(function Metrics({
  totalSupply,
  commonPool,
  onExecuteIssuance,
  stakeToken,
  requestToken,
  totalActiveTokens,
}) {
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'

  return (
    <Box
      heading="Honey"
      css={`
        margin-bottom: ${2 * GU}px;
      `}
    >
      <div
        css={`
          display: ${compactMode ? 'block' : 'flex'};
          align-items: flex-start;
          justify-content: space-between;
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
            src={honeySvg}
            height="60"
            width="60"
            alt=""
            onClick={onExecuteIssuance}
            css={`
              margin-right: ${4 * GU}px;
              cursor: pointer;
            `}
          />
          {compactMode && <TokenPrice token={stakeToken} />}
        </div>
        {!compactMode && <TokenPrice token={stakeToken} />}
        <div>
          <TokenBalance
            label="Common Pool"
            value={commonPool}
            token={requestToken}
          />
        </div>
        <div>
          <TokenBalance
            label="Token Supply"
            value={totalSupply}
            token={stakeToken}
          />
        </div>
        <div>
          <TokenBalance
            label="Active"
            value={totalActiveTokens}
            token={stakeToken}
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
          margin-bottom: ${1 * GU}px;
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

function TokenBalance({ label, token, value }) {
  const theme = useTheme()
  const usdValue = useTokenBalanceToUsd(value, token)

  return (
    <>
      <Metric label={label} value={formatTokenAmount(value, token.decimals)} />
      <div
        css={`
          color: ${theme.green};
        `}
      >
        $ {usdValue}
      </div>
    </>
  )
}

function TokenPrice({ token }) {
  const theme = useTheme()
  const usdValue = useTokenBalanceToUsd(bigNum(1), token)

  return (
    <div>
      <Metric label="Honey price" value={`$${usdValue}`} color={theme.green} />
      <Link
        href="https://uniswap.1hive.org/swap"
        external
        css={`
          ${textStyle('body3')};
          text-decoration: none;
          display: flex;
        `}
      >
        Trade
      </Link>
    </div>
  )
}

export default Metrics
