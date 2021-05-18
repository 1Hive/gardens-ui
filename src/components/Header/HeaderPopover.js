import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { GU, Popover, springs } from '@1hive/1hive-ui'
import { Spring, Transition, animated } from 'react-spring/renderprops'

const AnimatedDiv = animated.div

function HeaderPopover({
  children,
  direction,
  onClose,
  opener,
  screenData,
  screenId,
  screenKey,
  visible,
  width,
}) {
  const [animate] = useState(true)
  const [height, setHeight] = useState(30 * GU)
  const [measuredHeight, setMeasuredHeight] = useState(true)

  // Prevents to lose the focus on the popover when a screen leaves while an
  // element inside is focused (e.g. when clicking on the “disconnect” button).
  const popoverFocusElement = useRef()
  useEffect(() => {
    if (popoverFocusElement.current) {
      popoverFocusElement.current.focus()
    }
  }, [screenId])

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
      <section
        css={`
          display: flex;
          flex-direction: column;
          overflow: hidden;
        `}
      >
        <Spring
          config={springs.smooth}
          from={{ height: 32 * GU }}
          to={{ height }}
          immediate={!animate}
          native
        >
          {({ height }) => (
            <AnimatedDiv
              ref={popoverFocusElement}
              tabIndex="0"
              style={{ height: measuredHeight ? height : 'auto' }}
              css={`
                position: relative;
                flex-grow: 1;
                width: 100%;
                overflow: hidden;
                outline: 0;
              `}
            >
              <Transition
                native
                config={springs.smooth}
                items={screenData}
                keys={screenKey}
                from={{
                  opacity: 0,
                  transform: `translate3d(${3 * GU * direction}px, 0, 0)`,
                }}
                enter={{ opacity: 1, transform: `translate3d(0, 0, 0)` }}
                leave={{
                  opacity: 0,
                  transform: `translate3d(${3 * GU * -direction}px, 0, 0)`,
                }}
                immediate={!animate}
                onRest={(_, status) => {
                  if (status === 'update') {
                    setMeasuredHeight(false)
                  }
                }}
                onStart={(_, status) => {
                  setMeasuredHeight(true)
                }}
              >
                {screenData => ({ opacity, transform }) => (
                  <AnimatedDiv
                    ref={elt => {
                      if (elt) {
                        setHeight(elt.clientHeight)
                      }
                    }}
                    style={{ opacity, transform }}
                    css={`
                      position: ${measuredHeight ? 'absolute' : 'static'};
                      top: 0;
                      left: 0;
                      right: 0;
                    `}
                  >
                    {children(screenData)}
                  </AnimatedDiv>
                )}
              </Transition>
            </AnimatedDiv>
          )}
        </Spring>
      </section>
    </Popover>
  )
}

HeaderPopover.propTypes = {
  children: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  opener: PropTypes.any,
  visible: PropTypes.bool.isRequired,
}

export default HeaderPopover
