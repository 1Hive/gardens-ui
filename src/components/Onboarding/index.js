import React from 'react';
import { animated, Transition } from 'react-spring/renderprops';
import { RootPortal, springs, useTheme } from '@1hive/1hive-ui';
import Deployment from './Deployment/Deployment';
import { ChartsProvider } from '@providers/Charts';
import { OnboardingProvider, useOnboardingState } from '@providers/Onboarding';
import Setup from './Setup';
import { STATUS_GARDEN_SETUP } from './statuses';
/** @jsx jsx */
import { css, jsx } from '@emotion/react';

function Onboarding({ onClose, visible }) {
  const { status } = useOnboardingState();

  return (
    <AnimatedSlider visible={visible}>
      <div
        css={css`
          display: flex;
          height: 100%;
        `}
      >
        {status === STATUS_GARDEN_SETUP ? <Setup onClose={onClose} /> : <Deployment />}
      </div>
    </AnimatedSlider>
  );
}

function AnimatedSlider({ children, visible }) {
  const theme = useTheme();
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
                  background: theme.overlay.alpha(0.9).toString(),
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
                    css={css`
                      height: 100vh;
                      background-color: ${theme.surface.toString()};
                      border-top: 4px solid ${theme.accent.toString()};
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
  );
}

export default ({ ...props }) => (
  <OnboardingProvider>
    <ChartsProvider>
      <Onboarding {...props} />
    </ChartsProvider>
  </OnboardingProvider>
);
