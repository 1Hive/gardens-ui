import React from 'react'
import { Box, GU, textStyle, useTheme } from '@1hive/1hive-ui'
import { useOnboardingState } from '@providers/Onboarding'
import Header from '../kit/Header'
import Navigation from '../Navigation'

function HoneyswapLiquidity() {
  const theme = useTheme()
  const { config, onBack, onNext, step, steps } = useOnboardingState()
  const tokenSymbol = config.tokens.symbol

  return (
    <div>
      <Header
        title={`Configure HNY/${tokenSymbol} Pair`}
        subtitle={`Set the initial HNY-${tokenSymbol} token equivalence to define the initial Honeyswap liquidity pair.`}
      />

      <div>
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
              <span
                css={`
                  ${textStyle('title3')};
                  color: ${theme.contentSecondary};
                `}
              >
                0.3
              </span>
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
            <div
              css={`
                font-weight: bold;
              `}
            >
              ≈ 100 USD
              {/* TODO: Update 100 USD */}
            </div>
            <div
              css={`
                ${textStyle('body3')};
              `}
            >
              You must specify an amount worth at least 100 USD
            </div>
          </div>
        </div>
        <div
          css={`
            text-align: center;
            ${textStyle('title3')};
            margin: ${3 * GU}px 0;
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
              <span
                css={`
                  ${textStyle('title3')};
                  color: ${theme.contentSecondary};
                `}
              >
                0.3
              </span>
              <span
                css={`
                  ${textStyle('title4')};
                `}
              >
                {tokenSymbol}
              </span>
            </div>
          </Box>
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
              <span>1 {tokenSymbol} = 0.00257022 HNY</span>
              {/* TODO: Upadate rates */}
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
              <span>100 {tokenSymbol} + 0.257022 HNY</span>
              {/* TODO: Upadate liquidity provided */}
            </div>
          </div>
        </div>
      </div>

      <Navigation
        backEnabled
        nextEnabled
        nextLabel={`Next: ${steps[step + 1].title}`}
        onBack={onBack}
        onNext={onNext}
      />
    </div>
  )
}

export default HoneyswapLiquidity
