import React from 'react'
import PropTypes from 'prop-types'
import { GU, Popover, springs, textStyle, useTheme } from '@aragon/ui'
import { Spring, animated } from 'react-spring/renderprops'

const AnimatedSection = animated.section

function HeaderPopover({
  animateHeight,
  children,
  height,
  width,
  heading,
  onClose,
  opener,
  visible,
}) {
  const theme = useTheme()

  return (
    <Popover
      closeOnOpenerFocus
      onClose={onClose}
      opener={opener}
      placement="bottom-end"
      visible={visible}
      css={`
        width: ${width}px;
      `}
    >
      <Spring
        config={springs.smooth}
        from={{ height: `${38 * GU}px` }}
        to={{ height: `${height}px` }}
        immediate={!animateHeight}
        native
      >
        {({ height }) => (
          <AnimatedSection
            style={{ height }}
            css={`
              display: flex;
              flex-direction: column;
              overflow: hidden;
            `}
          >
            <h1
              css={`
                display: flex;
                flex-grow: 0;
                flex-shrink: 0;
                align-items: center;
                height: ${4 * GU}px;
                padding-left: ${2 * GU}px;
                border-bottom: 1px solid ${theme.border};
                color: ${theme.contentSecondary};
                ${textStyle('label2')};
              `}
            >
              {heading}
            </h1>
            <div
              css={`
                position: relative;
                flex-grow: 1;
                width: 100%;
              `}
            >
              {children}
            </div>
          </AnimatedSection>
        )}
      </Spring>
    </Popover>
  )
}

HeaderPopover.propTypes = {
  animateHeight: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  heading: PropTypes.node.isRequired,
  height: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  opener: PropTypes.any,
  visible: PropTypes.bool.isRequired,
}

export default HeaderPopover
