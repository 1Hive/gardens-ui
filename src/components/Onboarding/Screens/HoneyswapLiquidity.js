import React, { useCallback, useState } from 'react'
import { Box, GU, TextInput, textStyle, useTheme } from '@1hive/1hive-ui'
import Header from '../kit/Header'
import Navigation from '../Navigation'
import useHNYPriceOracle from '@hooks/useHNYPriceOracle'
import { useOnboardingState } from '@providers/Onboarding'

import { toDecimals } from '@utils/math-utils'

const MIN_HNY_USD = 100

function HoneyswapLiquidity() {
  const theme = useTheme()
  const [hnyAmount, setHnyAmount] = useState('')
  const [tokenAmount, setTokenAmount] = useState('')
  const { config, onBack, onNext, step, steps } = useOnboardingState()
  const tokenSymbol = config.tokens.symbol

  const [hnyPrice] = useHNYPriceOracle(toDecimals('1', 18))

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

  const liquidityProvided = hnyAmount && tokenAmount
  const nextEnabled = liquidityProvided && hnyAmount * hnyPrice >= 100

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
              <span
                css={`
                  ${textStyle('title4')};
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
                `}
              >
                ≈ {parseFloat(hnyPrice * hnyAmount, 2)} USD
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
              <span
                css={`
                  ${textStyle('title4')};
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
                  1 {tokenSymbol} = {hnyAmount / tokenAmount} HNY
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
        onNext={onNext}
      />
    </div>
  )
}

export default HoneyswapLiquidity
