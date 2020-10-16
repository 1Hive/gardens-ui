import React, { useContext, useEffect, useState } from 'react'
import {
  Box,
  GU,
  textStyle,
  Link,
  useLayout,
  useTheme,
  DropDown,
} from '@1hive/1hive-ui'

import { formatTokenAmount, formatDecimals } from '../lib/token-utils'
import honeySvg from '../assets/honey.svg'
import { useUniswapHnyPrice } from '../hooks/useUniswapHNYPrice'

const Metrics = React.memo(function Metrics({
  totalSupply,
  commonPool,
  onExecuteIssuance,
  stakeToken,
  requestToken,
  totalActiveTokens,
  currencies,
}) {
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'
  const [currentCurrency, setCurrency] = useState(1)
  const [currentLabel, setLabel] = useState(0)
  const [currentSymbol, setSymbol] = useState('$')

  const handleCurrencyChange = currentLabel => {
    switch (currentLabel) {
      case 0:
        setCurrency(currencies.USD)
        setSymbol('$')
        break
      case 1:
        setCurrency(currencies.EUR)
        setSymbol('€')
        break
      case 2:
        setCurrency(currencies.CAD)
        setSymbol('CAD $')
        break
      case 3:
        setCurrency(currencies.HKD)
        setSymbol('HK $')
        break
      case 4:
        setCurrency(currencies.JPY)
        setSymbol('¥')
        break
      case 5:
        setCurrency(currencies.AUD)
        setSymbol('AUD $')
        break
      case 6:
        setCurrency(currencies.GBP)
        setSymbol('£')
        break
      case 7:
        setCurrency(currencies.TRY)
        setSymbol('₺')
        break
      case 8:
        setCurrency(currencies.CNY)
        setSymbol('CN ¥ ')
        break
      case 9:
        setCurrency(currencies.KRW)
        setSymbol('₩')
        break
      case 10:
        setCurrency(currencies.RUB)
        setSymbol('₽')
        break
    }
    setLabel(currentLabel)
  }

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
          <DropDown
            header="Type"
            placeholder="USD"
            selected={currentLabel}
            onChange={handleCurrencyChange}
            css={`
              left: -${2 * GU}px;
            `}
            items={[
              'USD',
              'EUR',
              'CAD',
              'HKD',
              'JPY',
              'AUD',
              'GBP',
              'TRY',
              'CNY',
              'KRW',
              'RUB',
            ]}
          />
          <TokenPrice
            token={stakeToken}
            currency={currentCurrency}
            currentSymbol={currentSymbol}
          />
        </div>
        <div>
          <TokenBalance
            label="Common Pool"
            value={commonPool}
            token={requestToken}
            currency={currentCurrency}
            currentSymbol={currentSymbol}
          />
        </div>
        <div>
          <TokenBalance
            label="Token Supply"
            value={totalSupply}
            token={stakeToken}
            currency={currentCurrency}
            currentSymbol={currentSymbol}
          />
        </div>
        <div>
          <TokenBalance
            label="Active"
            value={totalActiveTokens}
            token={stakeToken}
            currency={currentCurrency}
            currentSymbol={currentSymbol}
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

function TokenBalance({ label, token, value, currency, currentSymbol }) {
  const theme = useTheme()

  const price = useUniswapHnyPrice()
  const usdValue = value * price * currency

  return (
    <>
      <Metric label={label} value={formatTokenAmount(value, token.decimals)} />
      <div
        css={`
          color: ${theme.green};
        `}
      >
        {currentSymbol} {formatTokenAmount(usdValue, token.decimals)}
      </div>
    </>
  )
}

function TokenPrice({ token, currency, currentSymbol }) {
  const theme = useTheme()
  const price = useUniswapHnyPrice()

  return (
    <div>
      <Metric
        label="Honey price"
        value={
          `${currentSymbol}` + `${parseFloat(price * currency).toFixed(2)}`
        }
        color={theme.green}
      />
      <Link
        href={`https://honeyswap.org/#/swap?inputCurrency=${token.id}`}
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
