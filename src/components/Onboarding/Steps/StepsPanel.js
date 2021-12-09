import React, { useMemo } from "react";
import { CircleGraph, GU, useTheme } from "@1hive/1hive-ui";
import Step from "./Step";
import { useOnboardingState } from "@providers/Onboarding";

import { css, jsx } from "@emotion/react";

function StepsPanel() {
  const theme = useTheme();
  const { step, steps } = useOnboardingState();

  const [displayedSteps] = useMemo(() => {
    let displayCount = 0;
    const displayedSteps = steps.map((step, index) => {
      const hiddenCount = index - displayCount;
      if (
        step.parent !== steps[index + 1]?.parent &&
        step.parent === steps[index - 1]?.parent
      ) {
        displayCount++;
        let substepIndex = index;
        const substeps = [];
        while (steps[substepIndex].parent === step.parent) {
          substeps.unshift([steps[substepIndex], substepIndex]);
          substepIndex--;
        }

        return [index, index - hiddenCount, true, substeps];
      }
      if (step.parent !== steps[index + 1]?.parent) {
        displayCount++;
        return [index, index - hiddenCount, true, []];
      }

      let statusIndex = index;
      while (
        step.parent === steps[statusIndex + 1].parent &&
        statusIndex < steps.length
      ) {
        statusIndex++;
      }

      return [statusIndex, index - hiddenCount, false];
    }, []);

    return [displayedSteps];
  }, [steps]);
  return (
    <aside
      css={css`
        width: 100%;
        min-height: 100%;
        padding-top: ${6 * GU}px;
        background: ${theme.surface.toString()};
        border-right: 1px solid ${theme.border.toString()};
      `}
    >
      <div
        css={css`
          position: relative;
          display: flex;
          width: 100%;
          justify-content: center;
          height: ${25 * GU}px;
        `}
      >
        <CircleGraph value={step / steps.length} size={25 * GU} />
      </div>
      <div
        css={css`
          padding: ${6 * GU}px ${3 * GU}px ${3 * GU}px;
        `}
      >
        {displayedSteps.map(
          ([statusIndex, displayIndex, show, substeps], index) =>
            show && (
              <Step
                key={index}
                currentStep={displayedSteps[step][0]}
                label={steps[statusIndex].parent}
                step={statusIndex}
                stepNumber={displayIndex + 1}
                substeps={substeps}
              />
            )
        )}
      </div>
    </aside>
  );
}

export default StepsPanel;
