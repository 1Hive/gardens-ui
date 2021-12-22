import React, { useMemo } from 'react'
import { Transition, animated } from 'react-spring/renderprops'
import {
  ButtonText,
  GU,
  textStyle,
  springs,
  useTheme,
  useViewport,
} from '@1hive/1hive-ui'
import ActivityItem from './ActivityItem'
import { useActivity } from '@providers/ActivityProvider'

import { ActivityStatus } from './activity-statuses'
// TODO- REPLACES THIS ASSET ONCE THE DESIGNER HAS ONE FOR GARDENS
import noDataSvg from '@assets/noData.svg'

// 8GU for top bar, 4GU for activity heading,
// 11GU for HelpScout beacon (3GU top/bottom padding, 5GU beacon)
const MIN_LIST_HEIGHT_ADJUST = (8 + 4 + 11) * GU
const MAX_LIST_HEIGHT_CLAMP = 96 * GU

function ActivityList() {
  const theme = useTheme()
  const { below, height } = useViewport()
  const { activities, clearActivities } = useActivity()

  const activityItems = useMemo(
    () => activities.sort((a, b) => b.createdAt - a.createdAt),
    [activities]
  )

  const canClear = useMemo(
    () =>
      activityItems.some(
        ({ status }) => status !== ActivityStatus.ACTIVITY_STATUS_PENDING
      ),
    [activityItems]
  )

  const maxHeight = Math.min(
    MAX_LIST_HEIGHT_CLAMP,
    Math.ceil(height - MIN_LIST_HEIGHT_ADJUST)
  )

  return (
    <div
      css={`
        /* Use 20px as the padding setting for popper is 10px */
        width: ${below('medium') ? `calc(100vw - 20px)` : `${42 * GU}px`};
      `}
    >
      <div
        css={`
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: ${4 * GU}px;
          padding: 0 ${2 * GU}px;
          border-bottom: 1px solid ${theme.border};
        `}
      >
        <label
          css={`
            ${textStyle('label2')}
            color: ${theme.surfaceContentSecondary};
          `}
        >
          Activity
        </label>
        {canClear && (
          <ButtonText
            onClick={clearActivities}
            css={`
              padding: 0;
              ${textStyle('label2')}
            `}
          >
            Clear all
          </ButtonText>
        )}
      </div>
      <div
        css={`
          max-height: ${maxHeight}px;
          overflow-x: hidden;
          overflow-y: auto;
        `}
      >
        {activityItems.length > 0 ? (
          <Transition
            native
            items={activityItems}
            keys={activity => activity.transactionHash}
            trail={50}
            enter={{
              opacity: 1,
              transform: 'translate3d(0px, 0, 0)',
            }}
            leave={{
              opacity: 0,
              transform: 'translate3d(20px, 0, 0)',
            }}
            config={springs.smooth}
          >
            {activity => transitionStyles => (
              <div
                css={`
                  & + & {
                    border-top: 1px solid ${theme.border};
                  }
                `}
              >
                <animated.div
                  style={{ ...transitionStyles, overflow: 'hidden' }}
                >
                  <ActivityItem activity={activity} />
                </animated.div>
              </div>
            )}
          </Transition>
        ) : (
          <div
            css={`
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: ${28.5 * GU}px;
            `}
          >
            <img src={noDataSvg} alt="No results" height="120" />
            <span
              css={`
                margin-top: ${2 * GU}px;
                ${textStyle('body2')}
              `}
            >
              No activity yet!
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ActivityList
