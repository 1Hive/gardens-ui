import React, { Fragment, useCallback, useReducer } from 'react'
import { GU, Help } from '@1hive/1hive-ui'
import { useOnboardingState } from '@providers/Onboarding'
import { Header, PercentageField } from '@components/Onboarding/kit'
import Navigation from '@components/Onboarding/Navigation'
import IssuanceChart from './IssuanceChart'

const CHART_HEIGHT = '350px'
const CHART_WIDTH = '100%'

function reduceFields(fields, [field, value]) {
  switch (field) {
    case 'initialRatio':
      return { ...fields, initialRatio: value }
    case 'targetRatio':
      return { ...fields, targetRatio: value }
    case 'maxAdjustmentRatioPerYear':
      return { ...fields, maxAdjustmentRatioPerYear: value }
    default:
      return fields
  }
}

function IssuanceSettings() {
  const {
    config,
    onBack,
    onConfigChange,
    onNext,
    step,
    steps,
  } = useOnboardingState()
  const [
    { initialRatio, targetRatio, maxAdjustmentRatioPerYear },
    updateField,
  ] = useReducer(reduceFields, { ...config.issuance })

  const handleInitialRatioChange = useCallback(
    value => {
      updateField(['initialRatio', value])
    },
    [updateField]
  )

  const handleTargetRatioChange = useCallback(
    value => {
      updateField(['targetRatio', value])
    },
    [updateField]
  )

  const handleMaxAdjustmentRatioPerYear = useCallback(
    value => {
      updateField(['maxAdjustmentRatioPerYear', value])
    },
    [updateField]
  )

  const handleNextClick = () => {
    // TODO: Validate data if necessary
    onConfigChange('issuance', { targetRatio, maxAdjustmentRatioPerYear })
    onNext()
  }

  return (
    <div>
      <Header
        title="Configure Issuance Parameters"
        subtitle="Model and create your community's economy "
      />
      <div
        css={`
          display: flex;
          flex-direction: column;
          margin: 0 ${2 * GU}px;
          margin-bottom: ${5 * GU}px;
        `}
      >
        <PercentageField
          label={
            <Fragment>
              Initial Ratio
              <Help hint="What is Target Ratio?">
                <strong>Initial Ratio</strong> is the initial fraction of the
                total supply that holds the Common Pool. For example, if Garden
                Seeds hold initially 90 garden tokens, and the initial ratio is
                10%, this means that the total supply of the Garden tokens is
                100, 10 of those are in the Common Pool.
              </Help>
            </Fragment>
          }
          value={initialRatio}
          onChange={handleInitialRatioChange}
        />
        <PercentageField
          label={
            <Fragment>
              Target Ratio
              <Help hint="What is Target Ratio?">
                <strong>Target Ratio</strong> is the ideal fraction of the total
                supply that should be in the Common Pool. For example, a value
                of 30% means that the token is going to be issued or burnt
                automatically overtime to reach a point in which a 30% of the
                total supply is in the Common Pool.
              </Help>
            </Fragment>
          }
          value={targetRatio}
          onChange={handleTargetRatioChange}
        />
        <PercentageField
          label={
            <Fragment>
              Throttle
              <Help hint="What is Issuance Throttle?">
                <strong>Throttle</strong>
                is a magnitude that prevents high issuance adjustments in small
                amounts of time. For example, a 1% will force the issuance to be
                practically linear, and a higher value will allow bigger
                adjustments.
              </Help>
            </Fragment>
          }
          value={maxAdjustmentRatioPerYear}
          onChange={handleMaxAdjustmentRatioPerYear}
        />
        {/* Issuance chart */}
        <div
          css={`
            align-self: center;
            width: 100%;
          `}
        >
          <IssuanceChart
            height={CHART_HEIGHT}
            width={CHART_WIDTH}
            maxAdjustmentRatioPerYear={maxAdjustmentRatioPerYear}
            targetRatio={targetRatio}
            initialRatio={initialRatio}
          />
        </div>
      </div>
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

export default IssuanceSettings
