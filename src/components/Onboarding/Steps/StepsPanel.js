import React, { useMemo } from 'react'
import { CircleGraph, GU, useTheme } from '@1hive/1hive-ui'
import StepsItem from './StepsItem'
import { Screens } from '../Screens/config'
import { useOnboardingState } from '@providers/Onboarding'

function StepsPanel() {
  const theme = useTheme()
  const { step } = useOnboardingState()

  const [displayedSteps, displayedStepsCount] = useMemo(() => {
    let displayCount = 0

    const displayedSteps = Screens.map((step, index) => {
      const hiddenCount = index - displayCount

      if (step.key !== Screens[index + 1]?.key) {
        displayCount++
        return [index, index - hiddenCount, true]
      }

      let statusIndex = index
      while (
        step.key === Screens[statusIndex + 1].key &&
        statusIndex < Screens.length
      ) {
        statusIndex++
      }

      return [statusIndex, index - hiddenCount, false]
    }, [])

    return [displayedSteps, displayCount]
  }, [])

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
        <CircleGraph
          value={displayedSteps[step][1] / (displayedStepsCount - 1)}
          size={25 * GU}
        />
        <div
          css={`
            position: absolute;
            top: 130px;
            font-size: 20px;
            color: #8e97b5;
            opacity: 0.7;
          `}
        >
          {`${displayedSteps[step][1] + 1}/${displayedStepsCount}`}
        </div>
      </div>
      <div
        css={`
          padding: ${8 * GU}px ${3 * GU}px ${3 * GU}px;
        `}
      >
        {displayedSteps.map(
          ([statusIndex, displayIndex, show], index) =>
            show && (
              <StepsItem
                key={index}
                currentStep={displayedSteps[step][0]}
                label={Screens[statusIndex].key}
                step={statusIndex}
                stepNumber={displayIndex + 1}
              />
            )
        )}
      </div>
    </aside>
  )
}

export default StepsPanel
