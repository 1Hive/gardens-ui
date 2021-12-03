import { GU, useTheme } from '@1hive/1hive-ui'
import React from 'react'
import { animated } from 'react-spring'

const AnimatedInnerSidebar = ({
  children,
  animationKey,
  animationProps,
  topElement,
  bottom = 0,
  left = 0,
  top = 0,
  width,
  zIndex = 2,
}) => {
  const theme = useTheme()
  return (
    <animated.div
      css={`
        width: ${width}px;
        position: absolute;
        top: ${top}px;
        bottom: ${bottom}px;
        left: ${left}px;
        height: 100vh;
        z-index: ${zIndex};
        background-color: ${theme.surface};
        border-right: 1px solid ${theme.border};
        box-shadow: 2px 0px 4px rgba(160, 168, 194, 0.16);
        flex-shrink: 0;
      `}
      key={animationKey}
      style={animationProps}
    >
      {topElement && (
        <div
          css={`
            padding: ${1.5 * GU}px ${2 * GU}px;
          `}
        >
          <div
            css={`
              padding-bottom: ${1.5 * GU}px;
              border-bottom: 1px solid ${theme.border};
            `}
          >
            {topElement}
          </div>
        </div>
      )}
      <nav
        css={`
          position: fixed;
          height: 100vh;
          overflow-y: scroll;
          width: 100%;
          pointer-events: none;
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
          &::-webkit-scrollbar {
            display: none;
          }
        `}
      >
        <div
          css={`
            width: ${width}px;
            display: flex;
            flex-direction: column;
            position: absolute;
            pointer-events: auto;
          `}
        >
          {children}
        </div>
      </nav>
    </animated.div>
  )
}

export default AnimatedInnerSidebar
