import React from 'react'
import { animated, Transition } from 'react-spring/renderprops'
import { GU, IconCross, RootPortal, springs, useTheme } from '@1hive/1hive-ui'
import gardensLogo from '@assets/gardensLogoMark.svg'
import { OnboardingProvider } from '@providers/Onboarding'
import { ChartsProvider } from '@providers/Charts'
import Screens from './Screens'
import StepsPanel from './Steps/StepsPanel'

function Onboarding({ onClose, visible }) {
  const theme = useTheme()

  return (
    <AnimatedSlider visible={visible}>
      <div
        css={`
          display: flex;
          height: 100%;
        `}
      >
        <div
          css={`
            width: ${41 * GU}px;
            flex-shrink: 0;
            flex-grow: 0;
          `}
        >
          <img
            css={`
              display: flex;
              padding-left: 18px;
              margin-top: 17px;
            `}
            src={gardensLogo}
            height={32}
            alt=""
          />
          <StepsPanel />
        </div>
        <div
          css={`
            width: 100%;
            flex-grow: 1;
            flex-shrink: 1;
            background: #f9f9f8;
          `}
        >
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
          <div
            css={`
              overflow-y: auto;
              height: calc(100vh - 127px);
            `}
          >
            <section
              css={`
                margin: 0px auto;
                max-width: 950px;
                padding: 0px 24px 48px;
              `}
            >
              <div
                css={`
                  display: flex;
                  flex-direction: column;
                `}
              >
                <Screens />
              </div>
            </section>
          </div>
        </div>
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
    <ChartsProvider>
      <Onboarding {...props} />
    </ChartsProvider>
  </OnboardingProvider>
)
