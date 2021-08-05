import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { GU, IconCheck, useTheme } from '@1hive/1hive-ui'

function ConfigureStepsItem({ stepNumber, step, label, currentStep, type }) {
  const theme = useTheme()

  const isStepType = type === 'step'

  const stepStyles = useMemo(() => {
    if (step === currentStep) {
      return `
        padding-top: 2px;
        background: ${theme.selected};
        color: ${theme.selectedContent};
      `
    }
    if (step < currentStep) {
      return `
        background: ${theme.positive};
        color: ${theme.positiveContent};
      `
    }
    return `
      padding-top: 2px;
      background: #ECEFF4;
      color: #9CA7B8;
    `
  }, [step, currentStep, theme])

  return (
    <div
      css={`
        display: flex;
        align-items: center;
        height: ${isStepType ? 5 * GU : 2 * GU}px;
        & + & {
          margin-top: ${3 * GU}px;
        }
      `}
    >
      <div
        css={`
          width: ${isStepType ? 5 * GU : 3 * GU}px;
          height: ${isStepType ? 5 * GU : 3 * GU}px;
          display: flex;
          margin-left: ${isStepType ? 0 : 4 * GU}px;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 18px;
          font-weight: 600;
          ${stepStyles};
          flex-shrink: 0;
          flex-grow: 0;
        `}
      >
        {step < currentStep ? <IconCheck /> : stepNumber}
      </div>
      <div
        css={`
          margin-left: ${isStepType ? 3 * GU : 6 * GU}px;
          font-size: ${isStepType ? 18 : 16}px;
          font-weight: ${step === currentStep ? '600' : '400'};
          overflow: hidden;
          text-overflow: ellipsis;
        `}
      >
        {label}
      </div>
    </div>
  )
}

ConfigureStepsItem.propTypes = {
  currentStep: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  step: PropTypes.number.isRequired,
  stepNumber: PropTypes.number.isRequired,
}

export default ConfigureStepsItem
