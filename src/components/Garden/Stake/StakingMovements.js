import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import {
  GU,
  IconAttention,
  IconCheck,
  IconClock,
  IconCross,
  IconLock,
  formatTokenAmount,
  Link,
  Tag,
  useTheme,
  DataView,
} from "@1hive/1hive-ui";
import { useGardenState } from "@providers/GardenState";
import {
  STAKING_SCHEDULED,
  STAKING_CHALLENGED,
  STAKING_COMPLETED,
  STAKING_CANCELLED,
  STAKING_SETTLED,
  COLLATERAL_LOCKED,
  COLLATERAL_CHALLENGED,
  COLLATERAL_AVAILABLE,
  COLLATERAL_SLASHED,
  STAKING_STATUSES,
  COLLATERAL_STATUSES,
} from "./staking-management-statuses";
import { buildGardenPath } from "@utils/routing-utils";
import { dateFormat, toMs } from "@utils/date-utils";
import noDataIllustration from "./assets/no-dataview-data.svg";

import { css, jsx } from "@emotion/react";

function getActionAttributes(status, theme) {
  const actionAttributes = {
    [STAKING_SCHEDULED]: {
      background: theme.infoSurface.toString(),
      color: theme.tagIndicatorContent.toString(),
      icon: <IconClock size="small" />,
    },
    [STAKING_CHALLENGED]: {
      background: theme.warningSurface.toString(),
      color: theme.warningSurfaceContent.toString(),
      icon: <IconAttention size="small" />,
    },
    [STAKING_COMPLETED]: {
      background: theme.positiveSurface.toString(),
      color: theme.positiveSurfaceContent.toString(),
      icon: <IconCheck size="small" />,
    },
    [STAKING_CANCELLED]: {
      background: theme.surfaceUnder.toString(),
      color: theme.contentSecondary.toString(),
      icon: <IconCross size="small" />,
    },
    [STAKING_SETTLED]: {
      background: theme.surfaceUnder.toString(),
      color: theme.contentSecondary.toString(),
      icon: <IconCross size="small" />,
    },
  };

  return actionAttributes[status];
}

function getCollateralAttributes(status, theme) {
  const collateralAttributes = {
    [COLLATERAL_LOCKED]: {
      color: theme.surfaceOpened.toString(),
      icon: <IconLock size="small" />,
    },
    [COLLATERAL_CHALLENGED]: {
      color: theme.surfaceOpened.toString(),
      icon: <IconLock size="small" />,
    },
    [COLLATERAL_AVAILABLE]: {
      color: theme.content.toString(),
    },
    [COLLATERAL_SLASHED]: {
      color: theme.negative.toString(),
    },
  };

  return collateralAttributes[status];
}

function StakingMovements({ stakingMovements, token }) {
  const { config } = useGardenState();
  const theme = useTheme();
  const history = useHistory();

  const handleGoToProposal = useCallback(
    (disputableActionId, disputableAddress) => {
      const proposalType =
        disputableAddress === config.voting.id ? "vote" : "proposal";

      const path = buildGardenPath(
        history.location,
        `${proposalType}/${disputableActionId}`
      );
      history.push(path);
    },
    [config, history]
  );

  return (
    <DataView
      fields={[
        { label: "Date" },
        { label: "Status" },
        { label: "Action" },
        { label: "Collateral state", align: "end" },
        { label: "Amount", align: "end" },
      ]}
      entries={stakingMovements}
      emptyState={{
        default: {
          illustration: <img src={noDataIllustration} alt="" />,
          subtitle: "You haven't locked any collateral yet",
        },
      }}
      renderEntry={({
        amount,
        createdAt,
        actionState,
        collateralState,
        tokenDecimals,
        disputableActionId,
        disputableAddress,
      }) => {
        const stakingStatus = STAKING_STATUSES.get(actionState);
        const actionAttributes = getActionAttributes(stakingStatus, theme);

        const collateralStatus = COLLATERAL_STATUSES.get(collateralState);
        const amountAttributes = getCollateralAttributes(
          collateralStatus,
          theme
        );

        return [
          <time
            dateTime={dateFormat(toMs(createdAt), "standard")}
            title={dateFormat(toMs(createdAt), "standard")}
          >
            {dateFormat(toMs(createdAt), "onlyDate")}
          </time>,
          <div>
            <Tag
              background={
                actionAttributes.background && `${actionAttributes.background}`
              }
              color={actionAttributes.color && `${actionAttributes.color}`}
              icon={actionAttributes.icon}
              mode="indicator"
              label={actionState}
            />
          </div>,
          <div>
            <Link
              onClick={() =>
                handleGoToProposal(disputableActionId, disputableAddress)
              }
            >
              Proposal #{disputableActionId}
            </Link>
          </div>,
          <div>{collateralState}</div>,
          <div
            css={css`
              font-weight: 600;
              color: ${amountAttributes.color};
              display: flex;
              align-items: center;
            `}
          >
            {amountAttributes.icon}
            <span
              css={css`
                margin-left: ${1 * GU}px;
              `}
            >
              {formatTokenAmount(amount, tokenDecimals, {
                symbol: token.symbol,
              })}
            </span>
          </div>,
        ];
      }}
    />
  );
}

export default StakingMovements;
