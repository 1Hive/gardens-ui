import React, { useEffect, useState } from 'react'
import { GU, springs } from '@1hive/1hive-ui'
import { Transition, animated } from 'react-spring/renderprops'
import { useOnboardingState } from '@providers/Onboarding'

const AnimatedDiv = animated.div

function OnboardingScreens() {
  const [prevStep, setPrevStep] = useState(-1)
  const { step, steps } = useOnboardingState()

  useEffect(() => {
    setPrevStep(step)
  }, [step])

  const direction = step > prevStep ? 1 : -1
  const { Screen, title } = steps[step]

  return (
    <Transition
      native
      reset
      unique
      items={{ step, Screen }}
      keys={({ step }) => step}
      from={{
        opacity: 0,
        position: 'absolute',
        transform: `translate3d(${10 * direction}%, 0, 0)`,
      }}
      enter={{
        opacity: 1,
        position: 'static',
        transform: `translate3d(0%, 0, 0)`,
      }}
      leave={{
        opacity: 0,
        position: 'absolute',
        transform: `translate3d(${-10 * direction}%, 0, 0)`,
      }}
      config={springs.smooth}
    >
      {({ Screen }) => ({ opacity, transform, position }) => (
        <div
          css={`
            overflow: hidden;
            position: relative;
          `}
        >
          <AnimatedDiv
            style={{ opacity, transform, position }}
            css={`
              top: 0;
              left: 0;
              right: 0;
            `}
          >
            <div
              css={`
                margin-bottom: ${2 * GU}px;
              `}
            >
              <Screen title={title} />
            </div>
          </AnimatedDiv>
        </div>
      )}
    </Transition>
  )
}

export default OnboardingScreens
