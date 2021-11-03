import React, { useCallback, useMemo, useState } from 'react'
import {
  Box,
  Button,
  GU,
  Help,
  textStyle,
  useLayout,
  useTheme,
} from '@1hive/1hive-ui'
import HelpTip from '@components/HelpTip'
import { useHoneyswapTokenPrice } from '@hooks/useHoneyswapTokenPrice'
import { usePriceOracle } from '@hooks/usePriceOracle'
import { useGardenState } from '@providers/GardenState'
import { useWallet } from '@providers/Wallet'

import { formatDecimals, formatTokenAmount } from '@utils/token-utils'

import defaultTokenLogo from '@assets/defaultTokenLogo.svg'

const Metrics = React.memo(function Metrics({
  commonPool,
  onExecuteIssuance,
  onRequestUpdatePriceOracle,
  priceToken,
  totalActiveTokens,
  totalSupply,
  totalWrappedSupply,
}) {
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
          justify-content: space-between;
        `}
      >
        <PriceSection
          onExecuteIssuance={onExecuteIssuance}
          onRequestUpdatePriceOracle={onRequestUpdatePriceOracle}
          currency={currency}
          token={priceToken}
        />
        <div>
          <TokenBalance
            label="Common Pool"
            value={commonPool.value}
            token={commonPool.token}
            currency={currency}
            helptip="common-pool"
          />
        </div>
        <div>
          <TokenBalance
            label="Total Supply"
            value={totalSupply.value}
            token={totalSupply.token}
            currency={currency}
            helptip="total-supply"
          />
        </div>
        {totalWrappedSupply && (
          <div>
            <TokenBalance
              label="Total Wrapped Supply"
              value={totalWrappedSupply.value}
              token={totalWrappedSupply.token}
              currency={currency}
              helptip="total-wrapped-supply"
            />
          </div>
        )}
        <div>
          <TokenBalance
            label="Total Support"
            value={totalActiveTokens.value}
            token={totalActiveTokens.token}
            currency={currency}
            helptip="total-support"
          />
        </div>
      </div>
    </Box>
  )
})

function PriceSection({
  token,
  onExecuteIssuance,
  currency,
  onRequestUpdatePriceOracle,
}) {
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'
  const [oracleMode, setOracleMode] = useState(false)

  const handleShowOracleMode = useCallback(() => {
    setOracleMode(!oracleMode)
  }, [oracleMode])
  return (
    <div
      css={`
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: ${(compactMode ? 2 : 0) * GU}px;
      `}
    >
      <DotSwitch checked={oracleMode} onChange={handleShowOracleMode} />
      <img
        src={token.logo || defaultTokenLogo}
        height="60"
        width="60"
        alt=""
        onClick={onExecuteIssuance}
        css={`
          margin-right: ${4 * GU}px;
          margin-left: ${4 * GU}px;
          cursor: pointer;
        `}
      />
      <TokenPrice
        currency={currency}
        token={token}
        oracleMode={oracleMode}
        onRequestUpdatePriceOracle={onRequestUpdatePriceOracle}
      />
    </div>
  )
}

function Metric({ label, value, symbol, color, helptip }) {
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
        {value}{' '}
        <span
          css={`
            ${textStyle('body3')}
          `}
        >
          {symbol}
        </span>
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
        symbol={token.symbol}
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

function TokenPrice({
  currency,
  oracleMode,
  token,
  onRequestUpdatePriceOracle,
}) {
  const { account } = useWallet()
  const theme = useTheme()

  const { config } = useGardenState()
  const { stableToken } = config.conviction

  const honeyswapPrice = useHoneyswapTokenPrice(token.id)

  const [convertedAmount, loading, canUpdate] = usePriceOracle(
    true,
    1,
    token.id,
    stableToken.id
  )

  const price = useMemo(() => {
    if (loading) {
      return 0
    }

    return oracleMode ? convertedAmount.valueOf() : honeyswapPrice
  }, [oracleMode, convertedAmount, honeyswapPrice, loading])

  return (
    <div
      css={`
        width: ${25 * GU}px;
      `}
    >
      <div
        css={`
          display: flex;
          justify-content: space-between;
        `}
      >
        <p
          css={`
            ${textStyle('title2')};
            margin-bottom: ${0.5 * GU}px;
          `}
        >
          {`${oracleMode ? 'Oracle' : ''} ${token.symbol} Price`}
        </p>
        {oracleMode && (
          <Help hint="What is Oracle Price?">
            This is the price used for funding proposals defined in xDAI.
            Calling update price could return a reward.
          </Help>
        )}
      </div>
      <span
        css={`
          display: flex;
          ${textStyle('title2')};
          color: ${theme.green};
        `}
      >
        {price > 0 ? (
          <span
            css={`
              width: ${17 * GU}px;
            `}
          >
            {currency.symbol}
            {formatDecimals(price * currency.rate, 2)}
          </span>
        ) : (
          <span
            css={`
              width: ${17 * GU}px;
            `}
          >
            -
          </span>
        )}
        {oracleMode && (
          <Button
            size="small"
            disabled={!canUpdate || !account}
            label="Update"
            onClick={onRequestUpdatePriceOracle}
          />
        )}
      </span>
    </div>
  )
}

function DotSwitch({ checked, onChange }) {
  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        justify-content: center;
      `}
    >
      <Dot isActive={!checked} onChange={onChange} />
      <Dot isActive={checked} onChange={onChange} />
    </div>
  )
}

function Dot({ isActive, onChange }) {
  return (
    <span
      onClick={
        !isActive
          ? e => {
              e.preventDefault()
              onChange()
            }
          : undefined
      }
      css={`
        height: 10px;
        width: 10px;
        margin: 5px;
        border: 1px solid #c8c8c9;
        background-color: ${isActive ? '#C8C8C9' : '#ffffff'};
        border-radius: 50%;
        display: inline-block;
        cursor: ${!isActive && 'pointer'};
      `}
    />
  )
}

export default Metrics
