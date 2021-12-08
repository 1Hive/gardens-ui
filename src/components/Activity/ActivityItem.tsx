/** @jsxImportSource @emotion/react */
import React, { useCallback } from "react";
import {
  blockExplorerUrl,
  ButtonBase,
  ButtonIcon,
  IconCross,
  IconCheck,
  GU,
  textStyle,
  IdentityBadge,
  useTheme,
} from "@1hive/1hive-ui";
import TimeTag from "./TimeTag";
import TransactionProgress from "./TransactionProgress";
import { useActivity } from "@providers/ActivityProvider";

import { getNetworkType, transformAddresses } from "@utils/web3-utils";
import { ActivityStatus } from "./activity-statuses";
import { getActivityData } from "./activity-types";
import { getNetwork } from "../../networks";
import { useAsset } from "@/hooks/useAsset";
import { css, jsx } from "@emotion/react";

function ActivityItem({ activity }) {
  const theme = useTheme();
  const { removeActivity } = useActivity();

  const { title, icon } = getActivityData(activity.type);
  const iconSrc = useAsset(icon);

  const handleOpen = useCallback(() => {
    if (activity.transactionHash) {
      window.open(
        blockExplorerUrl("transaction", activity.transactionHash, {
          networkType: getNetworkType(),
          provider: getNetwork().explorer,
        }),
        "_blank",
        "noopener"
      );
    }
  }, [activity]);

  const canClear = activity.status !== ActivityStatus.ACTIVITY_STATUS_PENDING;

  const handleClose = useCallback(() => {
    if (activity.transactionHash) {
      removeActivity(activity.transactionHash);
    }
  }, [activity, removeActivity]);

  return (
    <div
      css={css`
        position: relative;
      `}
    >
      <ButtonBase
        element="div"
        onClick={handleOpen}
        css={css`
          text-align: left;
          width: 100%;
        `}
      >
        <section
          css={css`
            display: flex;
            flex-direction: column;
            overflow: hidden;
            padding: ${2 * GU}px;
            background: ${activity.read
              ? theme.surface.toString()
              : theme.surfaceHighlight.toString()};
            transition-property: background;
            transition-duration: 50ms;
            transition-timing-function: ease-in-out;

            &:active {
              background: ${theme.surfaceUnder.toString()};
            }
          `}
        >
          <h1
            css={css`
              display: flex;
              align-items: center;
            `}
          >
            <div
              css={css`
                flex-shrink: 0;
                display: flex;
                margin-right: ${1 * GU}px;
              `}
            >
              <img src={iconSrc} alt="" height="28" />
            </div>
            <div
              css={css`
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: ${theme.surfaceContent.toString()};
                ${textStyle("body1")};
              `}
            >
              {title}
            </div>
            {activity.status !== ActivityStatus.ACTIVITY_STATUS_PENDING && (
              <TimeTag date={activity.createdAt} />
            )}
          </h1>
          <div
            css={css`
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
          css={css`
            position: absolute;
            top: ${1 * GU}px;
            right: ${1 * GU}px;
            z-index: 1;
          `}
        >
          <IconCross
            css={css`
              color: ${theme.surfaceIcon.toString()};
            `}
          />
        </ButtonIcon>
      )}
    </div>
  );
}

const ItemContent = React.memo(
  ({ text = "" }: { text: string }) => (
    <p
      css={css`
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        white-space: normal;
        word-break: break-word;
        overflow: hidden;
        ${textStyle("body2")}
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
);

function getStatusData(activity, theme) {
  if (activity.status === ActivityStatus.ACTIVITY_STATUS_CONFIRMED) {
    return [
      <IconCheck size="small" />,
      <span>Transaction confirmed</span>,
      theme.positive.toString(),
    ];
  }
  if (activity.status === ActivityStatus.ACTIVITY_STATUS_FAILED) {
    return [
      <IconCross size="small" />,
      <span>Transaction failed</span>,
      theme.negative.toString(),
    ];
  }
  if (activity.status === ActivityStatus.ACTIVITY_STATUS_TIMED_OUT) {
    return [
      <IconCross size="small" />,
      <span>Transaction timed out</span>,
      theme.negative.toString(),
    ];
  }
  return [
    null,
    <span>Transaction pending</span>,
    theme.surfaceContentSecondary.toString(),
  ];
}

const StatusMessage = ({ activity }) => {
  const theme = useTheme();
  const [icon, content, color] = getStatusData(activity, theme);
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        margin-top: ${2 * GU}px;
        ${textStyle("label2")}
        color: ${color}
      `}
    >
      {icon}
      {content}
    </div>
  );
};

export default ActivityItem;
