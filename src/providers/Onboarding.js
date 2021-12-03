import React, { useCallback, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Screens } from '@components/Onboarding/Screens/config'
import useGardenPoll from '@components/Onboarding/hooks/useGardenPoll'
import usePinataUploader from '@hooks/usePinata'
import useProgressSaver from '@components/Onboarding/hooks/useProgressSaver'
import { useWallet } from './Wallet'

import { DAY_IN_SECONDS } from '@utils/kit-utils'
import {
  calculateDecay,
  calculateWeight,
} from '@utils/conviction-modelling-helpers'
import {
  createGardenTxOne,
  createGardenTxThree,
  createGardenTxTwo,
  createPreTransactions,
  createTokenHoldersTx,
  extractGardenAddress,
} from '@components/Onboarding/transaction-logic'
import { BYOT_TYPE, NATIVE_TYPE } from '@components/Onboarding/constants'
import {
  STATUS_GARDEN_CREATED,
  STATUS_GARDEN_DEPLOYMENT,
  STATUS_GARDEN_SETUP,
} from '@components/Onboarding/statuses'
import { publishNewDao } from '@/services/github'

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
      community: [{}],
      documentation: [{}],
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
    gnosisSafe: '',
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
  const [status, setStatus] = useState(STATUS_GARDEN_SETUP)
  const [step, setStep] = useState(0)
  const [steps, setSteps] = useState(Screens)
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const [deployTransactions, setDeployTransactions] = useState([])
  const [gardenAddress, setGardenAddress] = useState('')

  const { account, ethers } = useWallet()
  const {
    hasSavedProgress,
    onClearProgress,
    onResume,
    onSaveConfig,
    onSaveStep,
    resumed,
  } = useProgressSaver(setConfig, setStep)

  // Upload covenant content to ipfs when ready (starting deployment txs)
  const [covenantIpfs] = usePinataUploader(
    config.agreement.covenantFile?.blob,
    status === STATUS_GARDEN_DEPLOYMENT
  )

  const handleConfigChange = useCallback(
    (key, data) =>
      setConfig(config => {
        const newConfig = {
          ...config,
          [key]: {
            ...config[key],
            ...data,
          },
        }
        onSaveConfig(newConfig)
        return newConfig
      }),
    [onSaveConfig]
  )

  const handleReset = useCallback(() => {
    setStatus(STATUS_GARDEN_SETUP)
    setStep(0)
    setSteps(Screens)
    setConfig(DEFAULT_CONFIG)
    setDeployTransactions([])
    setGardenAddress('')
    onClearProgress()
  }, [onClearProgress])

  const handleGardenCreated = useCallback(() => {
    setStatus(STATUS_GARDEN_CREATED)
  }, [])

  const handleStartDeployment = useCallback(() => {
    setStatus(STATUS_GARDEN_DEPLOYMENT)
  }, [])

  const publishGardenMetadata = useCallback(
    async txHash => {
      try {
        // Fetch garden address
        const gardenAddress = await extractGardenAddress(ethers, txHash)
        setGardenAddress(gardenAddress.toLowerCase())

        // Publish metadata to github
        await publishNewDao(gardenAddress, config.garden)
      } catch (err) {
        console.error(`Error publishing garden metadata ${err}`)
      }
    },
    [config, ethers]
  )

  const getTransactions = useCallback(
    async (covenantIpfsHash, account) => {
      // Token approvals
      const txs = [...(await createPreTransactions(config, account))]

      // Tx one
      txs.push(createGardenTxOne(config))

      if (config.garden.type === NATIVE_TYPE) {
        // Mint seeds balances
        txs.push(createTokenHoldersTx(config))
      }

      // Tx two, tx three
      txs.push(createGardenTxTwo(config), {
        ...createGardenTxThree(config, covenantIpfsHash),
        onDone: publishGardenMetadata,
      })

      return txs
    },
    [config, publishGardenMetadata]
  )

  // Navigation
  const handleBack = useCallback(() => {
    setStep(index => Math.max(0, index - 1))
  }, [])

  const handleNext = useCallback(() => {
    setStep(index => {
      const nextStep = Math.min(steps.length - 1, index + 1)
      onSaveStep(nextStep)
      return nextStep
    })
  }, [onSaveStep, steps.length])

  useEffect(() => {
    if (config.garden.type !== -1) {
      config.garden.type === BYOT_TYPE
        ? setSteps(
            Screens.filter(screen => !SKIPPED_SCREENS.includes(screen.title))
          )
        : setSteps(Screens)
    }
  }, [config.garden.type])

  useEffect(() => {
    if (!account || !covenantIpfs) {
      return
    }

    const buildDeployTransactions = async () => {
      try {
        const deployTxs = await getTransactions(covenantIpfs, account)
        setDeployTransactions(deployTxs)
      } catch (err) {
        console.error(err)
      }
    }

    buildDeployTransactions()
  }, [account, covenantIpfs, getTransactions])

  useGardenPoll(gardenAddress, handleGardenCreated)

  return (
    <OnboardingContext.Provider
      value={{
        config,
        deployTransactions,
        gardenAddress,
        onBack: handleBack,
        onConfigChange: handleConfigChange,
        onNext: handleNext,
        onReset: handleReset,
        onStartDeployment: handleStartDeployment,
        progress: { hasSavedProgress, onResume, resumed },
        status,
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
