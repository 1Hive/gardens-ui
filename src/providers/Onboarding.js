import React, { useCallback, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Screens } from '@components/Onboarding/Screens/config'
import { DAY_IN_SECONDS } from '@utils/kit-utils'
import {
  calculateDecay,
  calculateWeight,
} from '@utils/conviction-modelling-helpers'
import {
  createGardenTxOne,
  createGardenTxThree,
  createGardenTxTwo,
  createTokenApproveTxs,
  createTokenHoldersTx,
} from '@components/Onboarding/transaction-logic'
import { BYOT_TYPE, NATIVE_TYPE } from '@components/Onboarding/constants'

const OnboardingContext = React.createContext()

const SKIPPED_SCREENS = ['Issuance policy']

const DEFAULT_CONFIG = {
  garden: {
    name: '',
    description: '',
    logo: null,
    logo_type: null,
    token_logo: null,
    forum: '',
    links: {
      documentation: [{}],
      community: [{}],
    },
    type: -1,
  },
  agreement: {
    actionAmount: 0.1,
    challengeAmount: 0.1,
    challengePeriod: DAY_IN_SECONDS * 3,
    covenantFile: null,
    title: '',
  },
  conviction: {
    decay: calculateDecay(2),
    halflifeDays: 2,
    maxRatio: 10,
    minThreshold: 2,
    minThresholdStakePct: 5,
    requestToken: '',
    weight: calculateWeight(2, 10),
  },
  issuance: {
    maxAdjustmentRatioPerYear: 15,
    targetRatio: 30,
    initialRatio: 10,
  },
  liquidity: {
    denomination: 0,
    honeyTokenLiquidity: '',
    honeyTokenLiquidityStable: '',
    tokenLiquidity: '',
  },
  tokens: {
    address: '', // Only used in BYOT
    existingTokenSymbol: '', // Only used in BYOT
    name: '',
    decimals: 18,
    symbol: '',
    holders: [], // Only used in NATIVE
  },
  voting: {
    voteDuration: DAY_IN_SECONDS * 5,
    voteSupportRequired: 50,
    voteMinAcceptanceQuorum: 10,
    voteDelegatedVotingPeriod: DAY_IN_SECONDS * 2,
    voteQuietEndingPeriod: DAY_IN_SECONDS * 1,
    voteQuietEndingExtension: DAY_IN_SECONDS * 1,
    voteExecutionDelay: DAY_IN_SECONDS * 1,
  },
}

function OnboardingProvider({ children }) {
  const [step, setStep] = useState(0)
  const [steps, setSteps] = useState(Screens)
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

  const getTransactions = useCallback(
    async covenantIpfsHash => {
      // Token approvals
      const txs = [...createTokenApproveTxs(config)]

      // Tx one
      txs.push(createGardenTxOne(config))

      if (config.garden.type === NATIVE_TYPE) {
        // Mint seeds balances
        txs.push(createTokenHoldersTx(config))
      }

      // Tx two, tx three
      txs.push(
        createGardenTxTwo(config),
        createGardenTxThree(config, covenantIpfsHash)
      )

      return txs
    },
    [config]
  )

  useEffect(() => {
    if (config.garden.type !== -1) {
      config.garden.type === BYOT_TYPE
        ? setSteps(
            Screens.filter(screen => !SKIPPED_SCREENS.includes(screen.title))
          )
        : setSteps(Screens)
    }
  }, [config.garden.type])

  // Navigation
  const handleBack = useCallback(() => {
    setStep(index => Math.max(0, index - 1))
  }, [])

  const handleNext = useCallback(() => {
    setStep(index => Math.min(steps.length - 1, index + 1))
  }, [steps.length])

  return (
    <OnboardingContext.Provider
      value={{
        config,
        getTransactions,
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

export { OnboardingProvider, useOnboardingState, DEFAULT_CONFIG }
