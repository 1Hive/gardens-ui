import React from 'react'
import PropTypes from 'prop-types'
import { CircleGraph, GU, useTheme } from '@1hive/1hive-ui'
import StepsItem from './StepsItem'

function StepsPanel({ step, steps }) {
  const theme = useTheme()

  return (
    <aside
      css={`
        width: 100%;
        min-height: 100%;
        padding-top: ${10 * GU}px;
        background: ${theme.surface};
        border-right: 1px solid ${theme.border};
      `}
    >
      <div
        css={`
          position: relative;
          display: flex;
          width: 100%;
          justify-content: center;
          height: ${25 * GU}px;
        `}
      >
        <CircleGraph value={step / steps} size={25 * GU} />
        <div
          css={`
            position: absolute;
            top: 130px;
            font-size: 20px;
            color: #8e97b5;
            opacity: 0.7;
          `}
        >
          {`${step}/${steps}`}
        </div>
      </div>
      <div
        css={`
          padding: ${8 * GU}px ${3 * GU}px ${3 * GU}px;
        `}
      >
        {steps.map(
          ([statusIndex, displayIndex, show], index) =>
            show && (
              <StepsItem
                key={index}
                currentStep={groupedSteps[step][0]}
                label={steps[statusIndex]}
                step={statusIndex}
                stepNumber={displayIndex + 1}
              />
            )
        )}
      </div>
    </aside>
  )
}

StepsPanel.propTypes = {
  step: PropTypes.number.isRequired,
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default StepsPanel
