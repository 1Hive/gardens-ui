import React, { useCallback, useReducer } from 'react'
import { GU, Info, isAddress } from '@1hive/1hive-ui'
import Navigation from '@components/Onboarding/Navigation'
import { Header } from '@components/Onboarding/kit'
import { DEFAULT_CONFIG, useOnboardingState } from '@providers/Onboarding'

import {
  calculateDecay,
  calculateWeight,
} from '@utils/conviction-modelling-helpers'
import ConvictionVotingParameters from './ConvictionVotingParameters'

const DEFAULT_REQUESTED_AMOUNT = 2
const DEFAULT_STAKE_ON_PROPOSAL = 5
const DEFAULT_STAKE_ON_OTHER_PROPOSALS = 0

const reduceFields = (fields, [field, value]) => {
  switch (field) {
    case 'halflifeDays':
      return {
        ...fields,
        decay: calculateDecay(value),
        halflifeDays: value,
      }
    case 'minThreshold':
      return {
        ...fields,
        minThreshold: value,
        weight: calculateWeight(value, fields.maxRatio),
      }
    case 'minThresholdStakePct':
      return {
        ...fields,
        minThresholdStakePct: value,
      }
    case 'maxRatio':
      return {
        ...fields,
        maxRatio: value,
        weight: calculateWeight(fields.minThreshold, value),
      }
    case 'requestedAmount':
      return {
        ...fields,
        requestedAmount: value,
      }
    case 'requestToken':
      return {
        ...fields,
        requestToken: value,
      }
    default:
      return fields
  }
}

function ConvictionVotingSettings() {
  const {
    config,
    onBack,
    onConfigChange,
    onNext,
    step,
    steps,
  } = useOnboardingState()
  const [
    {
      decay,
      halflifeDays,
      maxRatio,
      minThreshold,
      minThresholdStakePct,
      requestedAmount,
      requestToken,
      stakeOnProposal,
      stakeOnOtherProposals,
      weight,
    },
    updateField,
  ] = useReducer(reduceFields, {
    ...config.conviction,
    requestedAmount: DEFAULT_REQUESTED_AMOUNT,
    stakeOnProposal: DEFAULT_STAKE_ON_PROPOSAL,
    stakeOnOtherProposals: DEFAULT_STAKE_ON_OTHER_PROPOSALS,
  })

  const DEFAULT_CONVICTION_CONFIG = DEFAULT_CONFIG.conviction

  const requestTokenInvalid = Boolean(requestToken) && !isAddress(requestToken)

  const handleHalflifeDaysChange = useCallback(
    value => {
      updateField(['halflifeDays', value])
    },
    [updateField]
  )

  const handleMaxRatioChange = useCallback(value => {
    updateField(['maxRatio', value])
  }, [])

  const handleMinThresholdChange = useCallback(
    value => {
      updateField(['minThreshold', value])
    },
    [updateField]
  )

  const handleRequestedAmountChange = useCallback(
    value => {
      updateField(['requestedAmount', value])
    },
    [updateField]
  )

  const handleMinThresholdStakePctChange = useCallback(
    value => {
      updateField(['minThresholdStakePct', value])
    },
    [updateField]
  )

  const handleRequestTokenChange = useCallback(
    value => {
      updateField(['requestToken', value])
    },
    [updateField]
  )

  const handleReset = useCallback(() => {
    updateField(['halflifeDays', DEFAULT_CONVICTION_CONFIG.halflifeDays])
    updateField(['maxRatio', DEFAULT_CONVICTION_CONFIG.maxRatio])
    updateField(['minThreshold', DEFAULT_CONVICTION_CONFIG.minThreshold])
    updateField([
      'minThresholdStakePct',
      DEFAULT_CONVICTION_CONFIG.minThresholdStakePct,
    ])
    updateField(['requestToken', config.tokens.address])
    updateField(['requestedAmount', DEFAULT_REQUESTED_AMOUNT])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.tokens.address, updateField])

  const handleNextClick = () => {
    onConfigChange('conviction', {
      decay,
      halflifeDays,
      maxRatio,
      minThreshold,
      minThresholdStakePct,
      requestToken,
      weight,
    })
    onNext()
  }

  return (
    <div>
      <Header
        title="Configure Governance"
        subtitle="Conviction voting"
        thirdtitle="Set parameters to incentivize community participation"
      />
      <ConvictionVotingParameters
        decay={decay}
        stakeOnProposal={stakeOnProposal}
        stakeOnOtherProposals={stakeOnOtherProposals}
        weight={weight}
        halflifeDays={halflifeDays}
        handleHalflifeDaysChange={handleHalflifeDaysChange}
        maxRatio={maxRatio}
        handleMaxRatioChange={handleMaxRatioChange}
        minThreshold={minThreshold}
        handleMinThresholdChange={handleMinThresholdChange}
        minThresholdStakePct={minThresholdStakePct}
        handleMinThresholdStakePctChange={handleMinThresholdStakePctChange}
        requestToken={requestToken}
        handleRequestTokenChange={handleRequestTokenChange}
        requestedAmount={requestedAmount}
        handleRequestedAmountChange={handleRequestedAmountChange}
        handleReset={handleReset}
      />

      {requestTokenInvalid && (
        <Info
          mode="error"
          css={`
            margin-bottom: ${3 * GU}px;
          `}
        >
          The request token address should be a valid address.
        </Info>
      )}

      <Navigation
        backEnabled
        nextEnabled={!requestTokenInvalid}
        nextLabel={`Next: ${steps[step + 1].title}`}
        onBack={onBack}
        onNext={handleNextClick}
      />
    </div>
  )
}

export default ConvictionVotingSettings
