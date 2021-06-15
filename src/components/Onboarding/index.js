import React from 'react'
import { animated, Transition } from 'react-spring/renderprops'
import { GU, IconCross, RootPortal, springs, useTheme } from '@1hive/1hive-ui'
import { OnboardingProvider } from '@providers/Onboarding'
import Screens from './Screens'
// import StepsPanel from './Steps/StepsPanel'

function Onboarding({ onClose, visible }) {
  const theme = useTheme()
  // const { step, steps } = useOnboardingState()

  return (
    <AnimatedSlider visible={visible}>
      <div
        css={`
          padding: ${3 * GU}px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        `}
      >
        <div />
        <div
          css={`
            cursor: pointer;
          `}
          onClick={onClose}
        >
          <IconCross color={theme.surfaceIcon} />
        </div>
      </div>
      <div>
        <div
          css={`
            width: ${41 * GU}px;
            flex-shrink: 0;
            flex-grow: 0;
          `}
        >
          {/* <StepsPanel step={step} steps={steps} /> */}
        </div>
        <section
          css={`
            display: flex;
            flex-direction: column;
            width: 100%;
            flex-grow: 1;
            flex-shrink: 1;
          `}
        >
          <div
            css={`
              display: flex;
              flex-direction: column;
              flex-grow: 1;
              position: relative;
              overflow: hidden;
            `}
          >
            <Screens />
          </div>
        </section>
      </div>
    </AnimatedSlider>
  )
}

function AnimatedSlider({ children, visible }) {
  const theme = useTheme()
  return (
    <RootPortal>
      <Transition
        native
        items={visible}
        from={{ opacity: 0, transform: 'translateY(100%)' }}
        enter={{ opacity: 1, transform: 'translateY(0%)' }}
        leave={{ opacity: 0, transform: 'translateY(100%)' }}
        config={{ ...springs.smooth, precision: 0.001 }}
      >
        {show =>
          show &&
          (({ opacity, transform }) => (
            <div>
              <animated.div
                style={{
                  position: 'fixed',
                  opacity,
                  top: '0',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  zIndex: '4',
                  background: theme.overlay.alpha(0.9),
                }}
              >
                <animated.div
                  style={{
                    transform,
                    position: 'fixed',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    filter: 'drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.15))',
                  }}
                >
                  <div
                    css={`
                      height: 100vh;
                      background-color: ${theme.surface};
                      border-top: 4px solid ${theme.accent};
                    `}
                  >
                    {children}
                  </div>
                </animated.div>
              </animated.div>
            </div>
          ))
        }
      </Transition>
    </RootPortal>
  )
}

export default ({ ...props }) => (
  <OnboardingProvider>
    <Onboarding {...props} />
  </OnboardingProvider>
)
