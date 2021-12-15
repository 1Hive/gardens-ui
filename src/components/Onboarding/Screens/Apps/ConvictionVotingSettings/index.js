/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useCallback, useReducer, useState } from 'react'
import {
  Button,
  GU,
  Help,
  Info,
  isAddress,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'
import AdvancedSettingsModal from './AdvancedSettingsModal'
import ConvictionVotingCharts from './ConvictionVotingCharts'
import Navigation from '@components/Onboarding/Navigation'
import {
  Header,
  PercentageField,
  SliderField,
} from '@components/Onboarding/kit'
import { DEFAULT_CONFIG, useOnboardingState } from '@providers/Onboarding'

import {
  calculateDecay,
  calculateWeight,
} from '@utils/conviction-modelling-helpers'

const MAX_HALF_LIFE_DAYS = 60
const DEFAULT_REQUESTED_AMOUNT = 2
const DEFAULT_STAKE_ON_PROPOSAL = 5
const DEFAULT_STAKE_ON_OTHER_PROPOSALS = 0

function validationError(
  halflifeDays,
  maxRatio,
  minThreshold,
  requestToken,
  minThresholdStakePct
) {
  if (halflifeDays === '0') {
    return 'Conviction growth cannot be zero.'
  }
  if (maxRatio === '0') {
    return 'Spending limit cannot be zero.'
  }
  if (minThreshold === '0') {
    return 'Minimum conviction cannot be zero.'
  }
  if (minThresholdStakePct === '0') {
    return 'Minimum active stake cannot be zero.'
  }
  if (Boolean(requestToken) && !isAddress(requestToken)) {
    return 'The request token address should be a valid address.'
  }
  return null
}

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
  const theme = useTheme()
  const {
    config,
    onBack,
    onConfigChange,
    onNext,
    step,
    steps,
  } = useOnboardingState()

  const [formError, setFormError] = useState(null)
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
  const [modalVisible, setModalVisible] = useState(false)

  const DEFAULT_CONVICTION_CONFIG = DEFAULT_CONFIG.conviction

  const handleHalflifeDaysChange = useCallback(
    value => {
      setFormError(null)
      updateField(['halflifeDays', value])
    },
    [updateField]
  )

  const handleMaxRatioChange = useCallback(value => {
    setFormError(null)
    updateField(['maxRatio', value])
  }, [])

  const handleMinThresholdChange = useCallback(
    value => {
      setFormError(null)
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
      setFormError(null)
      updateField(['minThresholdStakePct', value])
    },
    [updateField]
  )

  const handleRequestTokenChange = useCallback(
    event => {
      updateField(['requestToken', event.target.value])
    },
    [updateField]
  )

  const handleOpenModal = useCallback(() => setModalVisible(true), [])

  const handleCloseModal = useCallback(() => setModalVisible(false), [])

  const handleReset = useCallback(() => {
    updateField(['halflifeDays', DEFAULT_CONVICTION_CONFIG.halflifeDays])
    updateField(['maxRatio', DEFAULT_CONVICTION_CONFIG.maxRatio])
    updateField(['minThreshold', DEFAULT_CONVICTION_CONFIG.minThreshold])
    updateField([
      'minThresholdStakePct',
      DEFAULT_CONVICTION_CONFIG.minThresholdStakePct,
    ])
    updateField(['requestToken', config.tokens.address])
  }, [config.tokens.address, updateField])

  const handleNextClick = event => {
    event.preventDefault()
    const error = validationError(
      halflifeDays,
      maxRatio,
      minThreshold,
      requestToken,
      minThresholdStakePct
    )
    if (error) {
      setFormError(error)
      return
    }

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
      <div
        css={`
          display: flex;
          justify-content: space-between;
          margin-left: ${2 * GU}px;
          margin-bottom: ${3 * GU}px;
        `}
      >
        <div
          css={`
            display: flex;
            justify-content: center;
            flex-direction: column;
          `}
        >
          <SliderField
            label={
              <Fragment>
                Conviction Growth (days)
                <Help hint="What is Conviction Growth?">
                  <strong>Conviction Growth</strong> is the number of days it
                  takes to accumulate or reduce voting power by 50%. For
                  example, if the conviction growth is set to 1 day your tokens
                  must support a proposal for 1 day to reach 50% of those tokens
                  max voting power, 2 days to reach 75%, 3 days to reach 87.5%,
                  etc.
                </Help>
              </Fragment>
            }
            maxValue={MAX_HALF_LIFE_DAYS}
            value={halflifeDays}
            precision={2}
            onChange={handleHalflifeDaysChange}
          />
          <PercentageField
            label={
              <Fragment>
                Spending Limit
                <Help hint="What is Spending Limit?">
                  <strong>Spending Limit</strong> is the the maximum percentage
                  of total funds an individual proposal can request from the
                  common pool.
                </Help>
              </Fragment>
            }
            value={maxRatio}
            precision={2}
            onChange={handleMaxRatioChange}
          />
          <PercentageField
            label={
              <Fragment>
                Minimum Conviction
                <Help hint="What is Minimum Conviction?">
                  <strong>Minimum Conviction</strong> is the mininum percentage
                  of tokens that are used for calculating the threshold to pass
                  any proposal.
                </Help>
              </Fragment>
            }
            value={minThreshold}
            precision={2}
            onChange={handleMinThresholdChange}
          />
          <Button
            size="mini"
            onClick={handleOpenModal}
            label="Advanced..."
            css={`
              align-self: flex-end;
            `}
          />
          <AdvancedSettingsModal
            requestToken={requestToken}
            minThresholdStakePct={minThresholdStakePct}
            handleRequestTokenChange={handleRequestTokenChange}
            handleMinThresholdStakePctChange={handleMinThresholdStakePctChange}
            visible={modalVisible}
            onClose={handleCloseModal}
          />
          <div
            css={`
              display: flex;
              flex-direction: column;
              margin-top: ${4 * GU}px;
            `}
          >
            <div
              css={`
                color: ${theme.contentSecondary};
                margin-bottom: ${3 * GU}px;
                ${textStyle('body3')};
              `}
            >
              The next configuration allows you to play with different amounts,
              it is not an actual parameter. It will help you understand the
              significance of the threshold for conviction voting proposals:
            </div>
            <PercentageField
              label={
                <Fragment>
                  Requested Amount
                  <Help hint="What is Requested Amount?">
                    <strong>Requested Amount</strong> is the percentage of the
                    common pool being requested.
                  </Help>
                </Fragment>
              }
              value={requestedAmount}
              onChange={handleRequestedAmountChange}
            />
            <Button
              size="mini"
              onClick={handleReset}
              label="Reset Defaults"
              css={`
                align-self: flex-end;
              `}
            />
          </div>
        </div>
        <div
          css={`
            margin-left: ${5 * GU}px;
          `}
        >
          <ConvictionVotingCharts
            decay={decay}
            maxRatio={maxRatio}
            minActiveStakePct={minThresholdStakePct}
            requestedAmount={requestedAmount}
            stakeOnProposal={stakeOnProposal}
            stakeOnOtherProposals={stakeOnOtherProposals}
            weight={weight}
          />
        </div>
      </div>
      {formError && (
        <Info
          mode="error"
          css={`
            margin-bottom: ${3 * GU}px;
          `}
        >
          {formError}
        </Info>
      )}

      <Navigation
        backEnabled
        nextEnabled
        nextLabel={`Next: ${steps[step + 1].title}`}
        onBack={onBack}
        onNext={handleNextClick}
      />
    </div>
  )
}

export default ConvictionVotingSettings
