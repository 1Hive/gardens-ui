import React from 'react'
import PropTypes from 'prop-types'
import { GU, Popover, springs } from '@1hive/1hive-ui'
import { animated, Spring } from 'react-spring/renderprops'

const AnimatedSection = animated.section

function HeaderPopover({
  animateHeight,
  children,
  height,
  onClose,
  opener,
  visible,
  width,
}) {
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
  height: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  opener: PropTypes.any,
  visible: PropTypes.bool.isRequired,
}

export default HeaderPopover
