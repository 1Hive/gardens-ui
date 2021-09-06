import React, { useCallback, useState } from 'react'
import {
  Box,
  DropDown,
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

import { BYOT_TYPE } from '../constants'
import { toDecimals } from '@utils/math-utils'
import { getLocalTokenIconBySymbol } from '@utils/token-utils'

const MIN_HNY_USD = 100
const HNY_DENOMINATION = 0

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
  const {
    denomination,
    honeyTokenLiquidity,
    honeyTokenLiquidityStable,
    tokenLiquidity,
  } = config.liquidity
  const [hnyPrice, hnyPriceLoading] = useHNYPriceOracle(toDecimals('1', 18))

  const [denom, setDenom] = useState(denomination) // 0 HNY, 1 USD
  const [denominatedAmount, setDenominatedAmount] = useState(
    denom === HNY_DENOMINATION ? honeyTokenLiquidity : honeyTokenLiquidityStable
  )
  const [tokenAmount, setTokenAmount] = useState(tokenLiquidity)

  const handleDenominatedAmountChange = useCallback(event => {
    const newAmount = event.target.value
    if (isNaN(newAmount) || newAmount < 0) {
      return
    }

    setDenominatedAmount(newAmount)
  }, [])

  const handleTokenAmountChange = useCallback(event => {
    const newAmount = event.target.value
    if (isNaN(newAmount) || newAmount < 0) {
      return
    }

    setTokenAmount(newAmount)
  }, [])

  const handleNext = useCallback(
    event => {
      event.preventDefault()

      onConfigChange('liquidity', {
        denomination: denom,
        honeyTokenLiquidity:
          denom === HNY_DENOMINATION
            ? denominatedAmount
            : String(denominatedAmount / hnyPrice),
        honeyTokenLiquidityStable:
          denom === HNY_DENOMINATION
            ? String(denominatedAmount * hnyPrice)
            : denominatedAmount,
        tokenLiquidity: tokenAmount,
      })

      onNext()
    },
    [denom, denominatedAmount, hnyPrice, onConfigChange, onNext, tokenAmount]
  )

  const liquidityProvided = Boolean(denominatedAmount > 0 && tokenAmount > 0)
  const satisfiesMin =
    Number(
      denom === HNY_DENOMINATION
        ? denominatedAmount * hnyPrice
        : denominatedAmount
    ) >= 100

  const nextEnabled = liquidityProvided && satisfiesMin

  const tokenSymbol =
    config.garden.type === BYOT_TYPE
      ? config.tokens.existingTokenSymbol
      : config.tokens.symbol

  const convertedValue = parseFloat(
    denom === HNY_DENOMINATION
      ? denominatedAmount * hnyPrice
      : denominatedAmount / hnyPrice
  ).toFixed(2)

  const hnyAmount =
    denom === HNY_DENOMINATION ? denominatedAmount : convertedValue

  return (
    <div
      css={`
        max-width: 550px;
        margin: 0 auto;
      `}
    >
      <Header
        title="Configure Tokenomics"
        subtitle="Honeyswap liquidity"
        thirdtitle={`Set the initial HNY/${tokenSymbol} token equivalence`}
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
                value={denominatedAmount}
                onChange={handleDenominatedAmountChange}
                wide
                css={`
                  border: 0;
                  width: 100%;
                  padding: 0;
                  ${textStyle('title3')};
                  color: ${theme[
                    denominatedAmount ? 'content' : 'contentSecondary'
                  ]};
                `}
              />
              <DropDown
                items={[
                  <div
                    css={`
                      display: flex;
                      align-items: center;
                    `}
                  >
                    <img
                      src={getLocalTokenIconBySymbol('HNY')}
                      width="32"
                      height="32"
                      alt=""
                    />
                    <span
                      css={`
                        margin-left: ${1 * GU}px;
                        ${textStyle('title4')};
                      `}
                    >
                      HNY
                    </span>
                  </div>,
                  <span
                    css={`
                      margin-left: ${5 * GU}px;
                      ${textStyle('title4')};
                    `}
                  >
                    USD
                  </span>,
                ]}
                selected={denom}
                onChange={setDenom}
                width="150px"
                css={`
                  border: 0;
                  padding-left: 0;
                  padding-right: 0;
                  & > svg {
                    width: 24px;
                    height: 24px;
                  }
                `}
              />
            </div>
          </Box>
          <div
            css={`
              margin-top: ${1 * GU}px;
              color: ${theme.contentSecondary};
            `}
          >
            {denominatedAmount && (
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
                  <span>
                    {convertedValue}{' '}
                    {denom === HNY_DENOMINATION ? 'USD' : 'HNY'}
                  </span>
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
                  color: ${theme[tokenAmount ? 'content' : 'contentSecondary']};
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
                  1 {tokenSymbol} (
                  {parseFloat((hnyAmount * hnyPrice) / tokenAmount).toFixed(2)}{' '}
                  USD) = {parseFloat(hnyAmount / tokenAmount).toFixed(4)} HNY
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
