import React, { useCallback, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Screens } from '@components/Onboarding/Screens/config'
import usePinataUploader from '@hooks/usePinata'
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
  STATUS_GARDEN_DEPLOYMENT,
  STATUS_GARDEN_READY,
  STATUS_GARDEN_SETUP,
} from '@components/Onboarding/statuses'
import { publishNewDao } from '@/services/github'

const OnboardingContext = React.createContext()

const SKIPPED_SCREENS = ['Issuance policy']

const DEFAULT_CONFIG = {
  garden: {
    address: '',
    name: `Garden DAO test ${Math.floor(Math.random() * 100000)}`,
    description: 'test description',
    logo: null,
    logo_type: null,
    token_logo: null,
    forum: '',
    links: {
      documentation: [{}],
      community: [{}],
    },
    type: 0,
  },
  agreement: {
    actionAmount: 0.1,
    challengeAmount: 0.1,
    challengePeriod: DAY_IN_SECONDS * 3,
    covenantFile: null,
    title: 'agreement title',
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
    honeyTokenLiquidity: '1',
    honeyTokenLiquidityStable: '',
    tokenLiquidity: '1',
  },
  tokens: {
    address: '', // Only used in BYOT
    existingTokenSymbol: '', // Only used in BYOT
    name: 'Test token',
    decimals: 18,
    symbol: 'TST',
    holders: [['0x49C01b61Aa3e4cD4C4763c78EcFE75888b49ef50', 1]], // Only used in NATIVE
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

  // Upload covenant content to ipfs when ready (starting deployment txs)
  const [covenantIpfs] = usePinataUploader(
    config.agreement.covenantFile?.blob,
    status === STATUS_GARDEN_DEPLOYMENT
  )

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

  const handleStartDeployment = useCallback(() => {
    setStatus(STATUS_GARDEN_DEPLOYMENT)
  }, [])

  const publishGardenMetadata = useCallback(
    async txHash => {
      try {
        // Fetch garden address
        const gardenAddress = await extractGardenAddress(ethers, txHash)
        handleConfigChange('garden', { address: gardenAddress })
        setGardenAddress(gardenAddress)

        // Publish metadata to github
        await publishNewDao(gardenAddress, config.garden)
        setStatus(STATUS_GARDEN_READY)
      } catch (err) {
        console.error(`Error publishing garden metadata ${err}`)
      }
    },
    [config, ethers, handleConfigChange]
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
    setStep(index => Math.min(steps.length - 1, index + 1))
  }, [steps.length])

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

  return (
    <OnboardingContext.Provider
      value={{
        config,
        deployTransactions,
        gardenAddress,
        onBack: handleBack,
        onConfigChange: handleConfigChange,
        onNext: handleNext,
        onStartDeployment: handleStartDeployment,
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
