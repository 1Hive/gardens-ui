import React, { Fragment, useCallback, useReducer, useState } from 'react'
import { Button, GU, Help, Info, textStyle, useTheme } from '@1hive/1hive-ui'
import { PercentageField, SliderField } from '@components/Onboarding/kit'
import ConvictionVotingCharts from '@components/Onboarding/Screens/Apps/ConvictionVotingSettings/ConvictionVotingCharts'

import {
  calculateDecay,
  calculateWeight,
} from '@utils/conviction-modelling-helpers'
import AdvancedSettingsModal from './AdvanceCVSettingsModal'

const MAX_HALF_LIFE_DAYS = 20
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

function ConvictionVotingSettings({ initialSettings }) {
  const theme = useTheme()
  const [
    {
      decay,
      halflifeDays,
      maxRatio,
      minThreshold,
      minThresholdStakePct,
      requestedAmount,
      stakeOnProposal,
      stakeOnOtherProposals,
      weight,
    },
    updateField,
  ] = useReducer(reduceFields, {
    ...initialSettings,
    requestedAmount: DEFAULT_REQUESTED_AMOUNT,
    stakeOnProposal: DEFAULT_STAKE_ON_PROPOSAL,
    stakeOnOtherProposals: DEFAULT_STAKE_ON_OTHER_PROPOSALS,
  })

  const [openSettingsModal, setOpenSettingsModal] = useState(false)

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

  const handleOpenModal = useCallback(() => {
    setOpenSettingsModal(true)
  }, [setOpenSettingsModal])

  const handleCloseModal = useCallback(() => setOpenSettingsModal(false), [
    setOpenSettingsModal,
  ])

  const handleAdvancedSettingsDone = useCallback(
    value => updateField(['minThresholdStakePct', value]),
    [updateField]
  )

  return (
    <div>
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
                  must back a proposal for 1 day to reach 50% of those tokens'
                  max voting power, 2 days to reach 75%, 3 days to reach 87.5%,
                  etc.
                </Help>
              </Fragment>
            }
            minValue={1}
            maxValue={MAX_HALF_LIFE_DAYS}
            value={halflifeDays}
            onChange={handleHalflifeDaysChange}
          />
          <PercentageField
            label={
              <Fragment>
                Spending Limit
                <Help hint="What is Spending Limit?">
                  <strong>Spending Limit</strong> is the the maximum percentage
                  of total funds an individual proposal can request.
                </Help>
              </Fragment>
            }
            minValue={1}
            value={maxRatio}
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
            minValue={1}
            value={minThreshold}
            onChange={handleMinThresholdChange}
          />
          <Button
            size="mini"
            onClick={handleOpenModal}
            label="Advanced Settings"
            css={`
              align-self: flex-end;
            `}
          />
          <AdvancedSettingsModal
            minThresholdStakePct={minThresholdStakePct}
            stakeOnProposalPct={stakeOnProposal}
            visible={openSettingsModal}
            onClose={handleCloseModal}
            onDone={handleAdvancedSettingsDone}
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
              The next one is only to play around, not an actual parameter:
            </div>
            <PercentageField
              label={
                <Fragment>
                  Requested Amount
                  <Help hint="What is Requested Amount?">
                    <strong>Requested Amount</strong> is the percentage of total
                    funds being requested by the proposal displayed in the
                    charts.
                  </Help>
                </Fragment>
              }
              value={requestedAmount}
              onChange={handleRequestedAmountChange}
            />
          </div>
          <Button
            mode="strong"
            onClick={() => history.push('/home')}
            css={`
              margin-top: ${3 * GU}px;
            `}
          >
            Update Parameters
          </Button>
          <Info
            css={`
              margin-top: ${3 * GU}px;
            `}
          >
            This action will create a Decision vote.
          </Info>
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
    </div>
  )
}

export default ConvictionVotingSettings
