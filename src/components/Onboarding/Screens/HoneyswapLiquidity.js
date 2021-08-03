import React from 'react'
import { useOnboardingState } from '@providers/Onboarding'
import Header from '../kit/Header'
import Navigation from '../Navigation'
import { TextInput } from '@1hive/1hive-ui'

function HoneyswapLiquidity() {
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
          <TextInput
            value={settlementAmount}
            type="number"
            max={maxChallengeAmount}
            wide
            onChange={handleSettlementChange}
            required
          />
          <span>{tokenSymbol}</span>
        </div>
        <span>=</span>
        <div>
          <TextInput
            value={settlementAmount}
            type="number"
            max={maxChallengeAmount}
            wide
            adornmentSettings={{ padding: 0.5 * GU }}
            required
          />
          <span>HNY</span>
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
