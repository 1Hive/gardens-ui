import React, { useState } from 'react'
import {
  Box,
  GU,
  textStyle,
  useLayout,
  useTheme,
  DropDown,
} from '@1hive/1hive-ui'

import { useAppState } from '../providers/AppState'
import { useUniswapHnyPrice } from '../hooks/useUniswapHNYPrice'
import { formatDecimals, formatTokenAmount } from '../utils/token-utils'

import honeySvg from '../assets/honey.svg'

const Metrics = React.memo(function Metrics({
  commonPool,
  onExecuteIssuance,
  totalActiveTokens,
  totalSupply,
}) {
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'
  const { requestToken, stakeToken, currencies } = useAppState()

  const [currentCurrency, setCurrency] = useState(1)
  const [currentLabel, setLabel] = useState(0)
  const [currentSymbol, setSymbol] = useState('$')
  const currencyArray = [
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
  ]
  const handleCurrencyChange = currentLabel => {
    switch (currentLabel) {
      case 0:
        setCurrency(currencies.USD)
        setSymbol('$')
        break
      case 1:
        setCurrency(currencies.EUR)
        console.log(currencies.EUR)
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
          <div>
            <DropDown
              header="Type"
              placeholder="USD"
              selected={currentLabel}
              onChange={handleCurrencyChange}
              css={`
                left: -${2 * GU}px;
              `}
              items={currencyArray}
            />
          </div>
          <TokenPrice
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

function TokenBalance({ label, token, value, currency, currentSymbol }) {
  const theme = useTheme()

  const price = useUniswapHnyPrice()
  const currencyValue = value * price * currency

  return (
    <>
      <Metric label={label} value={formatTokenAmount(value, token.decimals)} />
      <div
        css={`
          color: ${theme.green};
        `}
      >
        {currentSymbol}{' '}
        {formatTokenAmount(currencyValue * currency, token.decimals)}
      </div>
    </>
  )
}

function TokenPrice({ currency, currentSymbol }) {
  const theme = useTheme()
  const price = useUniswapHnyPrice()

  return (
    <div>
      <p
        css={`
          ${textStyle('title2')};
          margin-bottom: ${0.5 * GU}px;
        `}
      >
        HNY Price
      </p>
      <span
        css={`
          ${textStyle('title2')};
          color: ${theme.green};
        `}
      >
        {currentSymbol}
        {formatDecimals(price * currency, 2)}
      </span>
    </div>
  )
}

export default Metrics
