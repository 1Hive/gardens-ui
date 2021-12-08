import React, { useCallback } from "react";
import {
  Button,
  Field,
  GU,
  textStyle,
  theme,
  useLayout,
} from "@1hive/1hive-ui";
import { useHoneyswapTokenPrice } from "@hooks/useHoneyswapTokenPrice";
import { useMultiModal } from "@components/MultiModal/MultiModalProvider";

import env from "@/environment";
import { formatTokenAmount } from "@utils/token-utils";
import { getDisputableAppByName } from "@utils/app-utils";

import iconFees from "@assets/iconFees.svg";
/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";

function ActionFeesModal({ agreement, onCreateTransaction }) {
  const { next } = useMultiModal();
  const { layoutName } = useLayout();
  const compactMode = layoutName === "small";

  const votingAppRequirements = getDisputableAppByName(
    agreement.disputableAppsWithRequirements,
    env("VOTING_APP_NAME")
  );

  const { actionAmount, token } = votingAppRequirements;
  const tokenPrice = useHoneyswapTokenPrice(token.id);

  const formattedAmount = formatTokenAmount(actionAmount, token.decimals);
  const dollarAmount =
    tokenPrice > 0
      ? formatTokenAmount(actionAmount * tokenPrice, token.decimals)
      : "-";

  const handleOnCreateTransaction = useCallback(() => {
    onCreateTransaction(() => {
      next();
    });
  }, [onCreateTransaction, next]);

  return (
    <div>
      <Field
        css={css`
          color: ${theme.surfaceContentSecondary.toString()};
        `}
      >
        <span
          css={css`
            ${compactMode ? textStyle("body3") : textStyle("body2")};
          `}
        >
          A small deposit is required for your decision to be submitted that
          will be held until the decision is finalised, point at which your
          deposit will be unlocked, and made available to you through the
          deposit manager. If your decision is disputed and cancelled by
          Celeste, your deposit will be lost.
        </span>
      </Field>

      <div
        css={css`
          display: flex;
          width: 100%;
          height: ${4 * GU}px;
          margin-top: ${!compactMode ? 3 * GU : 0}px;
          align-items: center;
          justify-content: space-between;
        `}
      >
        <div
          css={css`
            display: flex;
            align-items: center;
          `}
        >
          <img src={iconFees} alt="" height={4 * GU} width={4 * GU} />
          <h3
            css={css`
              font-weight: 600;
              margin-left: ${GU}px;
            `}
          >
            Decision Deposit
          </h3>
        </div>
        <div>
          <span
            css={css`
              text-align: left;
              font-weight: 600;
              ${compactMode ? textStyle("body3") : textStyle("body2")};
              margin-right: ${(compactMode ? 1.5 : 3) * GU}px;
            `}
          >
            ${dollarAmount}
          </span>

          <span
            css={css`
              font-weight: 600;
              ${compactMode ? textStyle("body3") : textStyle("body2")};
            `}
          >
            {formattedAmount} {token.symbol}
          </span>
        </div>
      </div>
      <Button
        label="Deposit and create decision"
        mode="strong"
        onClick={handleOnCreateTransaction}
        css={css`
          margin-top: ${3.125 * GU}px;
          width: 100%;
        `}
      />
    </div>
  );
}

export default ActionFeesModal;
