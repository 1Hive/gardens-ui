import React from 'react'
import { animated, useTransition } from 'react-spring'
import { GU, RootPortal, useTheme } from '@1hive/1hive-ui'

import InnerGardensSidebar from './InnerSidebars/InnerGardensSidebar'
import InnerGardenNavigationSidebar from './InnerSidebars/InnerGardenNavigationSidebar'

const GARDENS_SIDEBAR_WIDTH = 9 * GU
const NAVIGATION_SIDEBAR_WIDTH = screen.width - 18 * GU
const TOTAL_WIDTH = GARDENS_SIDEBAR_WIDTH + NAVIGATION_SIDEBAR_WIDTH

const AnimatedSidebar = ({
  animationKey,
  animationProps,
  children,
  width,
  top = 0,
  bottom = 0,
  left = 0,
  zIndex,
}) => {
  return (
    <animated.div
      css={`
        width: ${width};
        position: absolute;
        height: 100vh;
        z-index: ${zIndex};
        top: ${top};
        bottom: ${bottom};
        left: ${left};
      `}
      key={animationKey}
      style={animationProps}
    >
      {children}
    </animated.div>
  )
}

const MobileSidebar = ({ show, onToggle, onOpenCreateProposal }) => {
  const theme = useTheme()

  const sidebarTransition = useTransition(show, null, {
    from: {
      marginLeft: `-${TOTAL_WIDTH}px`,
      opacity: 0,
    },
    enter: {
      marginLeft: '0',
      opacity: 1,
    },
    leave: {
      marginLeft: `-${TOTAL_WIDTH}px`,
      opacity: 0,
    },
    unique: true,
    config: { mass: 5, tension: 1500, friction: 200 },
  })

  return sidebarTransition.map(({ item, key, props }) => {
    return item ? (
      <RootPortal>
        <AnimatedSidebar
          animationKey={key}
          animationProps={props}
          width={`${GARDENS_SIDEBAR_WIDTH}px`}
          zIndex={4}
        >
          <InnerGardensSidebar
            disableAnimation
            width={`${GARDENS_SIDEBAR_WIDTH}px`}
            onToggle={onToggle}
          />
        </AnimatedSidebar>
        <AnimatedSidebar
          animationKey={key.concat(1)}
          animationProps={props}
          width={`${NAVIGATION_SIDEBAR_WIDTH}px`}
          left={`${GARDENS_SIDEBAR_WIDTH}px`}
          top={`${8 * GU}px`}
          zIndex={3}
        >
          <InnerGardenNavigationSidebar
            width={`${NAVIGATION_SIDEBAR_WIDTH}px`}
            onToggle={onToggle}
            onOpenCreateProposal={onOpenCreateProposal}
          />
        </AnimatedSidebar>
        {/* Opaque background */}
        <animated.div
          css={`
            position: absolute;
            top: 0;
            left: ${GARDENS_SIDEBAR_WIDTH}px;
            right: 0;
            bottom: 0;
            z-index 1;
            background: ${theme.overlay.alpha(0.6)};
            pointer-events: ${show ? 'auto' : 'none'};
          `}
          style={props}
          key={key.concat(2)}
          onClick={onToggle}
        />
      </RootPortal>
    ) : null
  })
}

export default MobileSidebar
