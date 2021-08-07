import React, { useMemo } from 'react'
import { CircleGraph, GU, useTheme } from '@1hive/1hive-ui'
import Step from './Step'
import { Screens } from '../Screens/config'
import { useOnboardingState } from '@providers/Onboarding'

function StepsPanel() {
  const theme = useTheme()
  const { step } = useOnboardingState()

  const [displayedSteps] = useMemo(() => {
    let displayCount = 0

    const displayedSteps = Screens.map((step, index) => {
      const hiddenCount = index - displayCount
      if (
        step.parent !== Screens[index + 1]?.parent &&
        step.parent === Screens[index - 1]?.parent
      ) {
        displayCount++
        let substepIndex = index
        const substeps = []
        while (Screens[substepIndex].parent === step.parent) {
          substeps.unshift([Screens[substepIndex], substepIndex])
          substepIndex--
        }

        return [index, index - hiddenCount, true, substeps]
      }
      if (step.parent !== Screens[index + 1]?.parent) {
        displayCount++
        return [index, index - hiddenCount, true, []]
      }

      let statusIndex = index
      while (
        step.parent === Screens[statusIndex + 1].parent &&
        statusIndex < Screens.length
      ) {
        statusIndex++
      }

      return [statusIndex, index - hiddenCount, false]
    }, [])

    return [displayedSteps]
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
        <CircleGraph value={step / Screens.length} size={25 * GU} />
      </div>
      <div
        css={`
          padding: ${8 * GU}px ${3 * GU}px ${3 * GU}px;
        `}
      >
        {displayedSteps.map(
          ([statusIndex, displayIndex, show, substeps], index) =>
            show && (
              <Step
                key={index}
                currentStep={displayedSteps[step][0]}
                label={Screens[statusIndex].parent}
                step={statusIndex}
                stepNumber={displayIndex + 1}
                substeps={substeps}
              />
            )
        )}
      </div>
    </aside>
  )
}

export default StepsPanel
