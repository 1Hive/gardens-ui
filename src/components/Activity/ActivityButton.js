import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Spring, animated } from 'react-spring/renderprops'
import {
  ButtonIcon,
  IconAlert,
  Popover,
  GU,
  Tag,
  springs,
  useTheme,
} from '@1hive/1hive-ui'
import ActivityList from './ActivityList'
import { useActivity } from '../../providers/ActivityProvider'

const ActivityButton = React.memo(function ActivityButton() {
  const theme = useTheme()
  const [opened, setOpened] = useState(false)
  const { activities, markActivitiesRead, unreadCount } = useActivity()
  const containerRef = useRef()
  const popoverFocusElement = useRef()

  const handleToggle = useCallback(
    () =>
      setOpened(opened => {
        if (opened) {
          markActivitiesRead()
        }
        return !opened
      }),
    [markActivitiesRead]
  )

  const handleClose = useCallback(() => {
    markActivitiesRead()
    setOpened(false)
  }, [markActivitiesRead])

  useEffect(() => {
    if (popoverFocusElement.current) {
      popoverFocusElement.current.focus()
    }
  }, [activities])

  return (
    <React.Fragment>
      <div
        ref={containerRef}
        css={`
          width: ${7.25 * GU}px;
          display: flex;
          align-items: center;
          height: 100%;
          outline: 0;
        `}
      >
        <ButtonIcon
          element="div"
          onClick={handleToggle}
          css={`
            height: 100%;
            width: 100%;
            border-radius: 0;
            padding-left: ${0.5 * GU}px;
            justify-content: space-between;

            /* This is a bit of a hack to get the focus ring to appear only
             * around the button and not the spacer
             */
            &:focus:after {
              right: ${3 * GU}px;
            }
          `}
          label="Transaction activity"
        >
          <div
            css={`
              position: relative;
              line-height: 0;
            `}
          >
            <IconAlert
              css={`
                color: ${theme.hint};
              `}
            />
            <Spring
              native
              from={{ opacity: 0, size: 0 }}
              to={{
                opacity: Number(unreadCount > 0),
                size: Number(unreadCount > 0),
              }}
              config={springs.swift}
            >
              {({ opacity, size }) => (
                <animated.div
                  style={{
                    opacity,
                    transform: size
                      .interpolate(
                        [0, 0.2, 0.4, 0.6, 0.8, 1],
                        [1.5, 1, 1.5, 1, 1.5, 1]
                      )
                      .interpolate(s => `scale3d(${s}, ${s}, 1)`),
                  }}
                  css={`
                    position: absolute;
                    top: -${0.5 * GU}px;
                    right: -${0.5 * GU}px;
                  `}
                >
                  <Tag limitDigits mode="activity" label={unreadCount} />
                </animated.div>
              )}
            </Spring>
          </div>
          {/* Extend the width of the button to the edge of the top bar */}
          <div
            css={`
              width: ${3 * GU}px;
              height: 100%;
              background: ${theme.surface};
            `}
          />
        </ButtonIcon>
      </div>
      <Popover
        closeOnOpenerFocus
        placement="bottom-end"
        onClose={handleClose}
        visible={opened}
        opener={containerRef.current}
      >
        <div ref={popoverFocusElement} tabIndex="0" css="outline: 0">
          <ActivityList />
        </div>
      </Popover>
    </React.Fragment>
  )
})

export default ActivityButton
