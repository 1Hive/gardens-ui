import React from 'react'
import { Transition, animated } from 'react-spring/renderprops'

import { RootPortal, springs, useTheme } from '@1hive/1hive-ui'

import { ChartsProvider } from '@providers/Charts'
import { OnboardingProvider, useOnboardingState } from '@providers/Onboarding'

import Deployment from './Deployment/Deployment'
import Setup from './Setup'
import { STATUS_GARDEN_SETUP } from './statuses'

function Onboarding({ onClose, visible }) {
  return (
    <AnimatedSlider visible={visible}>
      <div
        css={`
          display: flex;
          height: 100%;
        `}
      >
        <OnboardingProvider>
          <ChartsProvider>
            <OnboardingPhases onClose={onClose} />
          </ChartsProvider>
        </OnboardingProvider>
      </div>
    </AnimatedSlider>
  )
}

function OnboardingPhases({ onClose }) {
  const { status } = useOnboardingState()

  return status === STATUS_GARDEN_SETUP ? (
    <Setup onClose={onClose} />
  ) : (
    <Deployment />
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
        {(show) =>
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

export default Onboarding
