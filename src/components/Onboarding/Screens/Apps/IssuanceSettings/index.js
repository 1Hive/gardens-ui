import React, { Fragment, useCallback, useReducer } from 'react'
import { GU, Help } from '@1hive/1hive-ui'
import { useOnboardingState } from '@providers/Onboarding'
import { Header, PercentageField } from '@components/Onboarding/kit'
import Navigation from '@components/Onboarding/Navigation'
// import IssuanceChart from './IssuanceChart'

// const CHART_HEIGHT = '350px'
// const CHART_WIDTH = '100%'

function reduceFields(fields, [field, value]) {
  switch (field) {
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
    { targetRatio, maxAdjustmentRatioPerYear },
    updateField,
  ] = useReducer(reduceFields, { ...config.issuance })

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
              Token Ratio
              <Help hint="What is Token Ratio?">
                <strong>Token Ratio</strong> is the ideal fraction of the total
                supply that should be in the Common Pool. For example, a value
                of 0.3 means that 30% of the total supply should ideally be in
                the Common Pool.
              </Help>
            </Fragment>
          }
          value={targetRatio}
          onChange={handleTargetRatioChange}
        />
        <PercentageField
          label={
            <Fragment>
              Max. Adjustment Per Year
              <Help hint="What is Max. Adjustment Per Year?">
                <strong>Max. Adjustment Per Year</strong>
                is the maximum issuance that can happen in a year. For example,
                a value of 0.1 means there can never be more than 10% new
                issuance per year.
              </Help>
            </Fragment>
          }
          value={maxAdjustmentRatioPerYear}
          onChange={handleMaxAdjustmentRatioPerYear}
        />
        {/* Issuance chart */}
        {/* <div
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
          />
        </div> */}
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
