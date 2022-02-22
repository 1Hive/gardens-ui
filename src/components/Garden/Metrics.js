import React, { useCallback, useMemo, useState } from 'react'
import {
  Box,
  Button,
  GU,
  Help,
  Split,
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
    <Split
      primary={
        <Box padding={3 * GU}>
          <div
            css={`
              display: grid;
              grid-template-columns: 2fr 1.5fr 1fr;
            `}
          >
            <PriceSection
              onExecuteIssuance={onExecuteIssuance}
              onRequestUpdatePriceOracle={onRequestUpdatePriceOracle}
              currency={currency}
              token={priceToken}
            />
            <SupplySection
              currency={currency}
              totalSupply={totalSupply}
              totalWrappedSupply={totalWrappedSupply}
            />
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
      }
      secondary={
        <Box padding={3 * GU}>
          <div
            css={`
              text-align: center;
            `}
          >
            <TokenBalance
              label="Common Pool"
              value={commonPool.value}
              token={commonPool.token}
              currency={currency}
              helptip="common-pool"
            />
          </div>
        </Box>
      }
    />
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
  const [priceMode, setPriceMode] = useState(true)

  const handleTogglePriceMode = useCallback(() => {
    setPriceMode((priceMode) => !priceMode)
  }, [])

  return (
    <div
      css={`
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: ${(compactMode ? 2 : 0) * GU}px;
      `}
    >
      <DotSwitch first={priceMode} onChange={handleTogglePriceMode} />
      <img
        src={token.logo || '/icons/base/defaultTokenLogo.svg'}
        height="60"
        width="60"
        alt=""
        onClick={onExecuteIssuance}
        css={`
          margin-right: ${4 * GU}px;
          margin-left: ${2 * GU}px;
          cursor: pointer;
        `}
      />
      <TokenPrice
        currency={currency}
        token={token}
        oracleMode={!priceMode}
        onRequestUpdatePriceOracle={onRequestUpdatePriceOracle}
      />
    </div>
  )
}

function SupplySection({ currency, totalSupply, totalWrappedSupply }) {
  const [supplyMode, setSupplyMode] = useState(true)

  const handleToggleSupplyMode = useCallback(() => {
    setSupplyMode((supplyMode) => !supplyMode)
  }, [])

  return (
    <div
      css={`
        display: flex;
        align-items: center;
      `}
    >
      {totalWrappedSupply && (
        <div
          css={`
            margin-right: ${2 * GU}px;
          `}
        >
          <DotSwitch first={supplyMode} onChange={handleToggleSupplyMode} />
        </div>
      )}
      {supplyMode ? (
        <div>
          <TokenBalance
            label="Total Supply"
            value={totalSupply.value}
            token={totalSupply.token}
            currency={currency}
            helptip="total-supply"
          />
        </div>
      ) : (
        <div>
          <TokenBalance
            label="Wrapped Supply"
            value={totalWrappedSupply.value}
            token={totalWrappedSupply.token}
            currency={currency}
            helptip="total-wrapped-supply"
          />
        </div>
      )}
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
          ${textStyle('title3')};
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

  const oraclePrice =
    price > 0
      ? `${currency.symbol} ${formatDecimals(price * currency.rate, 2)}`
      : '-'

  return (
    <div
      css={`
        width: ${25 * GU}px;
      `}
    >
      <div
        css={`
          display: flex;
          align-items: center;
        `}
      >
        <div
          css={`
            display: flex;
            flex-direction: column;
            ${textStyle('title4')};
            margin-bottom: ${0.5 * GU}px;
          `}
        >
          {token.symbol} Price
          {oracleMode && (
            <span
              css={`
                ${textStyle('body4')}
              `}
            >
              (Oracle)
            </span>
          )}
        </div>
        {oracleMode && (
          <span
            css={`
              margin-left: ${1 * GU}px;
            `}
          >
            <Help hint="What is Oracle Price?">
              This is the price used for funding proposals defined in stable
              asset. Calling update price could return a reward.
            </Help>
          </span>
        )}
      </div>
      <div
        css={`
          display: flex;
          align-items: center;
          ${textStyle('title2')};
          color: ${theme.green};
        `}
      >
        {oraclePrice}
        {oracleMode && (
          <Button
            size="mini"
            disabled={!canUpdate || !account}
            label="Update"
            onClick={onRequestUpdatePriceOracle}
            css={`
              margin-left: ${2 * GU}px;
            `}
          />
        )}
      </div>
    </div>
  )
}

function DotSwitch({ first, onChange }) {
  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        justify-content: center;
      `}
    >
      <Dot isActive={first} onChange={onChange} />
      <Dot isActive={!first} onChange={onChange} />
    </div>
  )
}

function Dot({ isActive, onChange }) {
  return (
    <span
      onClick={
        !isActive
          ? (e) => {
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
