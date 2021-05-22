import React, { useState, useCallback } from 'react'
import {
  BIG_RADIUS,
  ButtonIcon,
  Card,
  GU,
  IconUp,
  IconDown,
  RADIUS,
  springs,
  useTheme,
} from '@1hive/1hive-ui'
import { Spring, Transition, animated } from 'react-spring/renderprops'

const AnimatedDiv = animated.div

function ExpandableCard({ content, expansion }) {
  const [opened, setOpened] = useState(false)
  const theme = useTheme()

  const toggleButton = useCallback(() => {
    setOpened(opened => !opened)
  }, [])

  return (
    <div
      css={`
        position: relative;
        margin-bottom: ${RADIUS}px;
      `}
    >
      <OpenedSurfaceBorder opened={opened} />
      <Card
        css={`
          width: 100%;
          z-index: 2;
          height: auto;
          padding: ${3 * GU}px;
        `}
      >
        <ToggleButton onClick={toggleButton} opened={opened} />
        {content}
      </Card>
      <div
        css={`
          margin-top: ${-RADIUS}px;
        `}
      >
        <Transition
          native
          items={opened}
          from={{ height: 0 }}
          enter={{ height: 'auto' }}
          leave={{ height: 0 }}
        >
          {show =>
            show &&
            (props => (
              <AnimatedDiv
                css={`
                  background: ${theme.surfaceUnder};
                  overflow: hidden;
                  z-index: 1;
                `}
                style={props}
              >
                <div
                  css={`
                    width: 100%;
                    overflow: hidden;

                    padding: ${4 * GU}px ${3 * GU}px ${3 * GU}px;
                    box-shadow: inset 0 ${RADIUS + 4}px 4px -4px rgba(0, 0, 0, 0.16);
                  `}
                >
                  {expansion}
                </div>
              </AnimatedDiv>
            ))
          }
        </Transition>
      </div>
    </div>
  )
}

function ToggleButton({ onClick, opened }) {
  const theme = useTheme()
  return (
    <ButtonIcon
      label={opened ? 'Close' : 'Open'}
      focusRingRadius={RADIUS}
      onClick={onClick}
      css={`
        position: absolute;
        top: ${3.5 * GU}px;
        left: ${3.5 * GU}px;
        display: flex;
        flex-direction: column;
        color: ${theme.surfaceContentSecondary};
        & > div {
          display: flex;
          transform-origin: 50% 50%;
          transition: transform 250ms ease-in-out;
        }
      `}
    >
      <div
        css={`
          transform: rotate3d(${opened ? 1 : 0}, 0, 0, 180deg);
          transform: rotate3d(0, 0, ${opened ? 1 : 0}, 180deg);
        `}
      >
        <IconUp size="small" />
      </div>
      <div
        css={`
          transform: rotate3d(${opened ? -1 : 0}, 0, 0, 180deg);
          transform: rotate3d(0, 0, ${opened ? -1 : 0}, 180deg);
        `}
      >
        <IconDown size="small" />
      </div>
    </ButtonIcon>
  )
}

function OpenedSurfaceBorder({ opened }) {
  return (
    <Spring
      native
      from={{ width: 0 }}
      to={{ width: Number(opened) }}
      config={springs.smooth}
    >
      {({ width }) => (
        <div
          css={`
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            overflow: hidden;
            border-top-left-radius: ${BIG_RADIUS}px;
          `}
        >
          <AnimatedDiv
            css={`
              z-index: 3;
              position: absolute;
              top: 0;
              left: 0;
              height: 100%;
              width: 3px;
              background: linear-gradient(
                90deg,
                #32fff5 -103.98%,
                #01bfe3 80.13%
              );
              transform-origin: 0 0;
            `}
            style={{
              transform: width.interpolate(v => `scale3d(${v}, 1, 1)`),
            }}
          />
        </div>
      )}
    </Spring>
  )
}
export default ExpandableCard
