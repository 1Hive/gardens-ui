import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  blockExplorerUrl,
  ButtonBase,
  ButtonIcon,
  IconCross,
  IconCheck,
  GU,
  textStyle,
  useTheme,
  IdentityBadge,
} from '@1hive/1hive-ui'
import TimeTag from './TimeTag'
import TransactionProgress from './TransactionProgress'
import { useActivity } from '@providers/ActivityProvider'

import { getNetworkType, transformAddresses } from '@utils/web3-utils'
import {
  ACTIVITY_STATUS_PENDING,
  ACTIVITY_STATUS_CONFIRMED,
  ACTIVITY_STATUS_FAILED,
  ACTIVITY_STATUS_TIMED_OUT,
} from './activity-statuses'
import { getActivityData } from './activity-types'
import { getNetwork } from '../../networks'

import GARDEN_LOGO from '@assets/gardensLogoMark.svg'

function ActivityItem({ activity }) {
  const theme = useTheme()
  const { removeActivity } = useActivity()

  const { title } = getActivityData(activity.type)
  const iconSrc = GARDEN_LOGO

  const handleOpen = useCallback(() => {
    if (activity.transactionHash) {
      window.open(
        blockExplorerUrl('transaction', activity.transactionHash, {
          networkType: getNetworkType(),
          provider: getNetwork().explorer,
        }),
        '_blank',
        'noopener'
      )
    }
  }, [activity])

  const canClear = activity.status !== ACTIVITY_STATUS_PENDING

  const handleClose = useCallback(() => {
    if (activity.transactionHash) {
      removeActivity(activity.transactionHash)
    }
  }, [activity, removeActivity])

  return (
    <div
      css={`
        position: relative;
      `}
    >
      <ButtonBase
        element="div"
        onClick={handleOpen}
        css={`
          text-align: left;
          width: 100%;
        `}
      >
        <section
          css={`
            display: flex;
            flex-direction: column;
            overflow: hidden;
            padding: ${2 * GU}px;
            background: ${activity.read
              ? theme.surface
              : theme.surfaceHighlight};
            transition-property: background;
            transition-duration: 50ms;
            transition-timing-function: ease-in-out;

            &:active {
              background: ${theme.surfaceUnder};
            }
          `}
        >
          <h1
            css={`
              display: flex;
              align-items: center;
            `}
          >
            <div
              css={`
                flex-shrink: 0;
                display: flex;
                margin-right: ${1 * GU}px;
              `}
            >
              <img src={iconSrc} alt="" height="28" />
            </div>
            <div
              css={`
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: ${theme.surfaceContent};
                ${textStyle('body1')};
              `}
            >
              {title}
            </div>
            {activity.status !== ACTIVITY_STATUS_PENDING && (
              <TimeTag
                date={activity.createdAt}
                css={`
                  margin: 0 ${1.5 * GU}px;
                `}
              />
            )}
          </h1>
          <div
            css={`
              position: relative;
              margin-top: ${2 * GU}px;
            `}
          >
            <ItemContent text={activity.description} />
            <StatusMessage activity={activity} />
            <TransactionProgress
              status={activity.status}
              createdAt={activity.createdAt}
            />
          </div>
        </section>
      </ButtonBase>
      {canClear && (
        <ButtonIcon
          label="Remove"
          onClick={handleClose}
          css={`
            position: absolute;
            top: ${1 * GU}px;
            right: ${1 * GU}px;
            z-index: 1;
          `}
        >
          <IconCross
            css={`
              color: ${theme.surfaceIcon};
            `}
          />
        </ButtonIcon>
      )}
    </div>
  )
}

ActivityItem.propTypes = {
  activity: PropTypes.object.isRequired,
}

const ItemContent = React.memo(
  ({ text = '' }) => (
    <p
      css={`
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        white-space: normal;
        word-break: break-word;
        overflow: hidden;
        ${textStyle('body2')}
      `}
    >
      {transformAddresses(text, (part, isAddress, index) =>
        isAddress ? (
          <span title={part} key={index}>
            <IdentityBadge entity={part} compact />
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </p>
  ),
  (prevProps, nextProps) => prevProps.text === nextProps.text
)

ItemContent.propTypes = {
  text: PropTypes.string.isRequired,
}

function getStatusData(activity, theme) {
  if (activity.status === ACTIVITY_STATUS_CONFIRMED) {
    return [
      <IconCheck size="small" />,
      <span>Transaction confirmed</span>,
      theme.positive,
    ]
  }
  if (activity.status === ACTIVITY_STATUS_FAILED) {
    return [
      <IconCross size="small" />,
      <span>Transaction failed</span>,
      theme.negative,
    ]
  }
  if (activity.status === ACTIVITY_STATUS_TIMED_OUT) {
    return [
      <IconCross size="small" />,
      <span>Transaction timed out</span>,
      theme.negative,
    ]
  }
  return [null, <span>Transaction pending</span>, theme.surfaceContentSecondary]
}

const StatusMessage = ({ activity }) => {
  const theme = useTheme()
  const [icon, content, color] = getStatusData(activity, theme)
  return (
    <div
      css={`
        display: flex;
        align-items: center;
        margin-top: ${2 * GU}px;
        ${textStyle('label2')}
        color: ${color}
      `}
    >
      {icon}
      {content}
    </div>
  )
}

StatusMessage.propTypes = {
  activity: PropTypes.object.isRequired,
}

export default ActivityItem
