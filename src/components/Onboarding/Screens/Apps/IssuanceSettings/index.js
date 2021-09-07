import React, { Fragment, useCallback, useReducer } from 'react'
import { Button, GU, Help, Info } from '@1hive/1hive-ui'
import IssuanceChart from './IssuanceChart'
import { Header, PercentageField } from '@components/Onboarding/kit'
import Navigation from '@components/Onboarding/Navigation'
import { DEFAULT_CONFIG, useOnboardingState } from '@providers/Onboarding'

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

  const { issuance: DEFAULT_ISSUANCE_CONFIG } = DEFAULT_CONFIG

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

  const handleReset = useCallback(() => {
    updateField(['initialRatio', DEFAULT_ISSUANCE_CONFIG.initialRatio])
    updateField(['targetRatio', DEFAULT_ISSUANCE_CONFIG.targetRatio])
    updateField([
      'maxAdjustmentRatioPerYear',
      DEFAULT_ISSUANCE_CONFIG.maxAdjustmentRatioPerYear,
    ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateField])

  const handleNextClick = () => {
    // TODO: Validate data if necessary
    onConfigChange('issuance', {
      initialRatio,
      targetRatio,
      maxAdjustmentRatioPerYear,
    })
    onNext()
  }

  return (
    <div>
      <Header
        title="Configure Tokenomics"
        subtitle="Issuance policy"
        thirdtitle="Model your community's economy"
      />
      <div
        css={`
          display: flex;
          flex-direction: column;
          margin: 0 ${2 * GU}px;
          margin-bottom: ${4 * GU}px;
        `}
      >
        <PercentageField
          label={
            <Fragment>
              Initial Ratio
              <Help hint="What is Initial Ratio?">
                <strong>Initial Ratio</strong> is the initial fraction of the
                total supply that is held in the common pool. For example, if
                seed token holders have 90 tokens, and the initial ratio is 10%,
                this means that the total supply of tokens is 100. And 10 are in
                the common pool.
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
                supply that should be in the common pool. For example, a value
                of 30% means the token will be issued or burnt overtime to
                ensure that the amount of tokens held in the common pool always
                converges to 30% of the total supply.
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
                The <strong>issuance throttle</strong> prevents high issuance or
                burnt adjustments in short periods of time. For example, a 1%
                throttle will force the issuance to be practically linear.
                Higher values allow for bigger adjustments.
              </Help>
            </Fragment>
          }
          value={maxAdjustmentRatioPerYear}
          onChange={handleMaxAdjustmentRatioPerYear}
        />
        <Button
          size="mini"
          onClick={handleReset}
          label="Reset Defaults"
          css={`
            align-self: flex-end;
          `}
        />
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
        <Info
          css={`
            margin-top: ${3 * GU}px;
          `}
        >
          The initial ratio refers to the ratio of tokens to be minted and sent
          to the Common Pool. These will then be available to be distributed
          through conviction voting.
        </Info>
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
