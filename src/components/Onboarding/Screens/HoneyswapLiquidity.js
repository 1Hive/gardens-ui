import React, { useCallback, useState } from 'react'
import {
  Box,
  GU,
  LoadingRing,
  TextInput,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'
import Header from '../kit/Header'
import Navigation from '../Navigation'
import useHNYPriceOracle from '@hooks/useHNYPriceOracle'
import { useOnboardingState } from '@providers/Onboarding'

import { toDecimals } from '@utils/math-utils'
import { getLocalTokenIconBySymbol } from '@utils/token-utils'

const MIN_HNY_USD = 100

function HoneyswapLiquidity() {
  const theme = useTheme()
  const {
    config,
    onBack,
    onConfigChange,
    onNext,
    step,
    steps,
  } = useOnboardingState()
  const { honeyTokenLiquidity, tokenLiquidity } = config.liquidity
  const [hnyPrice, hnyPriceLoading] = useHNYPriceOracle(toDecimals('1', 18))

  const [hnyAmount, setHnyAmount] = useState(honeyTokenLiquidity || '')
  const [tokenAmount, setTokenAmount] = useState(tokenLiquidity || '')

  const handleHnyAmountChange = useCallback(event => {
    const newAmount = event.target.value
    if (isNaN(newAmount)) {
      return
    }

    setHnyAmount(newAmount)
  }, [])

  const handleTokenAmountChange = useCallback(event => {
    const newAmount = event.target.value
    if (isNaN(newAmount)) {
      return
    }

    setTokenAmount(newAmount)
  }, [])

  const handleNext = useCallback(
    event => {
      event.preventDefault()

      onConfigChange('liquidity', {
        honeyTokenLiquidity: hnyAmount,
        honeyTokenLiquidityStable: hnyAmount * hnyPrice,
        tokenLiquidity: tokenAmount,
      })

      onNext()
    },
    [hnyAmount, hnyPrice, onConfigChange, onNext, tokenAmount]
  )

  const liquidityProvided = hnyAmount && tokenAmount
  const nextEnabled = liquidityProvided && hnyAmount * hnyPrice >= 100
  const tokenSymbol = config.tokens.symbol

  return (
    <div>
      <Header
        title="Configure HNY liquidity"
        subtitle={`Set the initial HNY - ${tokenSymbol} token equivalence to define the initial Honeyswap liquidity pair.`}
      />
      <div
        css={`
          margin-bottom: ${4 * GU}px;
        `}
      >
        <div>
          <Box padding={2 * GU}>
            <div>Input</div>
            <div
              css={`
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-top: ${1.5 * GU}px;
              `}
            >
              <TextInput
                placeholder="0.0"
                value={hnyAmount}
                onChange={handleHnyAmountChange}
                wide
                css={`
                  border: 0;
                  width: 100%;
                  padding: 0;
                  ${textStyle('title3')};
                  color: ${theme.contentSecondary};
                `}
              />
              <img
                src={getLocalTokenIconBySymbol('HNY')}
                width="32"
                height="32"
                alt=""
              />
              <span
                css={`
                  ${textStyle('title4')};
                  margin-left: ${1 * GU}px;
                `}
              >
                HNY
              </span>
            </div>
          </Box>
          <div
            css={`
              margin-top: ${1 * GU}px;
              color: ${theme.contentSecondary};
            `}
          >
            {hnyAmount && (
              <div
                css={`
                  font-weight: bold;
                  display: flex;
                  align-items: center;
                `}
              >
                <span
                  css={`
                    margin-right: ${0.5 * GU}px;
                  `}
                >
                  ≈
                </span>
                {hnyPriceLoading ? (
                  <LoadingRing />
                ) : (
                  <span>{parseFloat(hnyPrice * hnyAmount).toFixed(2)} USD</span>
                )}
              </div>
            )}
            <div
              css={`
                ${textStyle('body3')};
              `}
            >
              You must specify an amount worth at least {MIN_HNY_USD} USD
            </div>
          </div>
        </div>
        <div
          css={`
            text-align: center;
            ${textStyle('title2')};
            margin: ${2 * GU}px 0;
          `}
        >
          <span>+</span>
        </div>
        <div>
          <Box padding={2 * GU}>
            <div>Input</div>
            <div
              css={`
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-top: ${1.5 * GU}px;
              `}
            >
              <TextInput
                placeholder="0.0"
                value={tokenAmount}
                onChange={handleTokenAmountChange}
                wide
                css={`
                  border: 0;
                  width: 100%;
                  padding: 0;
                  ${textStyle('title3')};
                  color: ${theme.contentSecondary};
                `}
              />
              <img
                src={getLocalTokenIconBySymbol(tokenSymbol)}
                width="32"
                height="32"
                alt=""
              />
              <span
                css={`
                  ${textStyle('title4')};
                  margin-left: ${1 * GU}px;
                `}
              >
                {tokenSymbol}
              </span>
            </div>
          </Box>
          {liquidityProvided && (
            <div
              css={`
                margin-top: ${3 * GU}px;
                color: ${theme.contentSecondary};
                ${textStyle('body3')};
              `}
            >
              <div
                css={`
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                `}
              >
                <span>Initial price</span>
                <span>
                  1 {tokenSymbol} ={' '}
                  {parseFloat(hnyAmount / tokenAmount).toFixed(2)} HNY
                </span>
              </div>
              <div
                css={`
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  margin-top: ${1 * GU}px;
                `}
              >
                <span>Liquidity provided</span>
                <span>
                  {tokenAmount} {tokenSymbol} + {hnyAmount} HNY
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <Navigation
        backEnabled
        nextEnabled={nextEnabled}
        nextLabel={`Next: ${steps[step + 1].title}`}
        onBack={onBack}
        onNext={handleNext}
      />
    </div>
  )
}

export default HoneyswapLiquidity
