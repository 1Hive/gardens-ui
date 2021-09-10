import React, { useCallback, useReducer } from 'react'
import { Button, GU, Info } from '@1hive/1hive-ui'
import {
  calculateDecay,
  calculateWeight,
} from '@utils/conviction-modelling-helpers'
import ConvictionVotingParameters from '@/components/Onboarding/Screens/Apps/ConvictionVotingSettings/ConvictionVotingParameters'

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
    default:
      return fields
  }
}

const C_V_ONE_HUNDRED_PERCENT = 1e7
const ONE_HUNDRED_PCT = 1e18

const adjustConvictionParameters = (
  decay,
  maxRatio,
  weight,
  minThresholdStakePct
) => {
  const [adjustedDecay, adjustedMaxRatio, adjustedWeight] = [
    decay,
    maxRatio,
    weight,
  ].map(value => Math.floor(value * C_V_ONE_HUNDRED_PERCENT).toString())

  const adjustedMinThresholdStakePct = (
    minThresholdStakePct * ONE_HUNDRED_PCT
  ).toString()

  return {
    adjustedDecay,
    adjustedMaxRatio,
    adjustedWeight,
    adjustedMinThresholdStakePct,
  }
}

function ConvictionVotingSettings({ onUpdateParameters, settings }) {
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
    ...settings,
    requestedAmount: DEFAULT_REQUESTED_AMOUNT,
    stakeOnProposal: DEFAULT_STAKE_ON_PROPOSAL,
    stakeOnOtherProposals: DEFAULT_STAKE_ON_OTHER_PROPOSALS,
  })

  const DEFAULT_CONVICTION_CONFIG = settings

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

  const handleReset = useCallback(() => {
    updateField(['halflifeDays', DEFAULT_CONVICTION_CONFIG.halflifeDays])
    updateField(['maxRatio', DEFAULT_CONVICTION_CONFIG.maxRatio])
    updateField(['minThreshold', DEFAULT_CONVICTION_CONFIG.minThreshold])
    updateField([
      'minThresholdStakePct',
      DEFAULT_CONVICTION_CONFIG.minThresholdStakePct,
    ])
    updateField(['requestedAmount', DEFAULT_REQUESTED_AMOUNT])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateField])

  return (
    <div
      css={`
        display: flex;
        align-items: flex-start;
        justify-content: center;
        flex-direction: column;
        margin-left: ${20 * GU}px;
        margin-right: ${20 * GU}px;
      `}
    >
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
        requestedAmount={requestedAmount}
        handleRequestedAmountChange={handleRequestedAmountChange}
        handleReset={handleReset}
      />
      <Button
        label="Update parameters"
        mode="strong"
        onClick={onUpdateParameters(
          adjustConvictionParameters(
            decay,
            maxRatio,
            weight,
            minThresholdStakePct
          )
        )}
      />
      <Info
        css={`
          margin-top: ${3 * GU}px;
        `}
      >
        This action create a desion proposal that decides if enact the changes.
      </Info>
    </div>
  )
}

export default ConvictionVotingSettings
