import React, { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { Screens as steps } from '@components/Onboarding/Screens/config'
import { DAY_IN_SECONDS } from '@utils/kit-utils'
import {
  calculateDecay,
  calculateWeight,
} from '@utils/conviction-modelling-helpers'
import { getNetwork } from '@/networks'
import { getContract } from '@hooks/useContract'

import { NATIVE_TYPE } from '@components/Onboarding/constants'
import templateAbi from '@abis/gardensTemplate.json'
import { encodeFunctionData } from '@utils/web3-utils'
import { ZERO_ADDR } from '@/constants'

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
    weight: calculateWeight(2, 10),
  },
  issuance: {
    maxAdjustmentRatioPerYear: 15,
    targetRatio: 30,
    initialRatio: 10,
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
  },
  voting: {
    voteDuration: DAY_IN_SECONDS * 5,
    voteSupportRequired: 50,
    voteMinAcceptanceQuorum: 10,
    voteDelegatedVotingPeriod: DAY_IN_SECONDS * 2,
    voteQuietEndingPeriod: DAY_IN_SECONDS * 1,
    voteQuietEndingExtension: DAY_IN_SECONDS * 0.5,
    voteExecutionDelay: DAY_IN_SECONDS * 1,
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

  const getTransactions = useCallback(() => {
    const txs = [createGardenTxOne(config)]

    if (config.garden.type === NATIVE_TYPE) {
      txs.push(createTokenHoldersTx(config))
    }

    txs.push(createGardenTxTwo(config), createGardenTxThree(config))

    return txs
  }, [config])

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

// TODO: See where to place them or keep them here
function createGardenTxOne(config) {
  const existingToken =
    config.garden.type === NATIVE_TYPE ? ZERO_ADDR : config.tokens.address

  const gardenTokenLiquidity =
    config.garden.type === NATIVE_TYPE ? config.liquidity.tokenLiquidity : 0
  const existingTokenLiquidity =
    config.garden.type === NATIVE_TYPE ? 0 : config.liquidity.tokenLiquidity

  const commonPool = 0 // TODO: Get commonpool from intialRatio and total sum of stakes

  return createTx('createGardenTxOne', [
    existingToken,
    config.tokens.name,
    config.tokens.symbol,
    [
      commonPool,
      config.liquidity.honeyTokenLiquidityStable,
      gardenTokenLiquidity,
      existingTokenLiquidity,
    ],
    [...config.voting],
  ])
}

function createTokenHoldersTx(config) {
  const accounts = config.tokens.holders.map(([account]) => account)
  const stakes = config.tokens.holders.map(([_, stake]) => stake)

  return createTx('createTokenHolders', [accounts, stakes])
}

function createGardenTxTwo(config) {
  return createTx('createGardenTxTwo', [
    config.issuance.targetRatio,
    config.issuance.maxAdjustmentRatioPerYear,
  ])
}

function createGardenTxThree(config) {}

function createTx(fn, params) {
  const network = getNetwork()
  const templateAddress = network.template
  const templateContract = getContract(templateAddress, templateAbi)

  const data = encodeFunctionData(templateContract, fn, params)

  return {
    to: templateAddress,
    data,
  }
}

export { OnboardingProvider, useOnboardingState }
