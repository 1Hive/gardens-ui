import React from "react";
import { GU, LoadingRing, textStyle, useTheme } from "@1hive/1hive-ui";
import { useDisputeFees } from "@hooks/useDispute";
import honeyIconSvg from "@assets/honey.svg";
import { formatTokenAmount } from "@utils/token-utils";
import { css, jsx } from "@emotion/react";

function DisputeFees({ proposal }) {
  const theme = useTheme();
  const fees = useDisputeFees();

  return (
    <div>
      <h2
        css={css`
          ${textStyle("label1")};
          font-weight: 200;
          color: ${theme.surfaceContentSecondary.toString()};
          margin-bottom: ${2 * GU}px;
        `}
      >
        Celeste Dispute Fee
      </h2>

      {fees.loading ? (
        <LoadingRing />
      ) : (
        <div
          css={css`
            ${textStyle("body2")};
          `}
        >
          <div
            css={css`
              display: flex;
              align-items: center;
            `}
          >
            <img
              src={honeyIconSvg}
              alt=""
              height="28"
              width="28"
              css={css`
                margin-right: ${0.5 * GU}px;
              `}
            />
            {proposal.challengerArbitratorFee && (
              <div>
                {formatTokenAmount(
                  fees.amount,
                  proposal.challengerArbitratorFee.tokenDecimals
                )}{" "}
                {proposal.challengerArbitratorFee.tokenSymbol}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default DisputeFees;
