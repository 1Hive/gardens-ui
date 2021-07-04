import React, { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { Screens as steps } from '@components/Onboarding/Screens/config'

const OnboardingContext = React.createContext()

const DEFAULT_CONFIG = {
  garden: {
    name: '',
    description: '',
    logo: null,
    logo_type: null,
    token_logo: null,
    forum: '',
    links: {
      documentation: [[]],
      community: [[]],
    },
    type: -1,
  },
  agreement: {
    title: '',
    content: '',
    challengePeriod: 0,
    actionAmount: 0,
    challengeAmount: 0,
    actionAmountsStable: [],
    challengeAmountsStable: [],
  },
  conviction: {
    decay: 0,
    maxRatio: 0,
    minThresholdStakePercentage: 0,
    requestToken: '',
    weight: 0,
  },
  issuance: {
    maxAdjustmentRatioPerSecond: 0,
    targetRatio: 0,
  },
  liquidity: {
    honeyTokenLiquidityStable: 0,
    tokenLiquidity: 0,
  },
  tokens: {
    address: '', // Only used in BYOT
    name: '',
    symbol: '',
    holders: [], // Only used in NATIVE
    commonPool: 0, // Only used in NATIVE
  },
  voting: {
    voteDuration: 0,
    voteSupportRequired: 0,
    voteMinAcceptanceQuorum: 0,
    voteDelegatedVotingPeriod: 0,
    voteQuietEndingPeriod: 0,
    voteQuietEndingExtension: 0,
    voteExecutionDelay: 0,
  },
}

function OnboardingProvider({ children }) {
  const [step, setStep] = useState(0)
  const [config, setConfig] = useState(DEFAULT_CONFIG)

  const handleConfigChange = useCallback(
    (key, data) =>
      setConfig(config => ({
        ...config,
        [key]: {
          ...config[key],
          ...data,
        },
      })),
    []
  )

  // Navigation
  const handleBack = useCallback(() => {
    setStep(index => Math.max(0, index - 1))
  }, [])

  const handleNext = useCallback(() => {
    setStep(index => Math.min(steps.length - 1, index + 1))
  }, [])

  return (
    <OnboardingContext.Provider
      value={{
        config,
        onBack: handleBack,
        onConfigChange: handleConfigChange,
        onNext: handleNext,
        step,
        steps,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

OnboardingProvider.propTypes = {
  children: PropTypes.node,
}

function useOnboardingState() {
  return useContext(OnboardingContext)
}

export { OnboardingProvider, useOnboardingState }
