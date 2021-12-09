import React from "react";
import { GU, IconCheck, RADIUS, textStyle, useTheme } from "@1hive/1hive-ui";
import { useGardenState } from "@providers/GardenState";

import { addressesEqual } from "@utils/web3-utils";
import { formatTokenAmount } from "@utils/token-utils";
import {
  getAccountCastDelegatedStake,
  getAccountCastStake,
} from "@utils/vote-utils";
import { VOTE_YEA } from "@/constants";
import { css, jsx } from "@emotion/react";

function VoteCasted({ account, accountVote, caster, vote }) {
  const { config } = useGardenState();
  const { token } = config.voting;
  const accountStake = getAccountCastStake(vote, account);
  const accountDelegatedStake = getAccountCastDelegatedStake(vote, account);
  const totalStake = accountStake.plus(accountDelegatedStake);

  const theme = useTheme();

  return (
    <div
      css={css`
        border-radius: ${RADIUS}px;
        background: ${theme.background.toString()};
        padding: ${3.5 * GU}px ${10 * GU}px;
        text-align: center;
        margin-top: ${2 * GU}px;
      `}
    >
      <div
        css={css`
          display: inline-grid;
          grid-template-columns: auto 1fr;
          grid-gap: ${3 * GU}px;
          align-items: center;
          text-align: left;
        `}
      >
        <div>
          <div
            css={css`
              border: 3px solid ${theme.accent.toString()};
              border-radius: 50%;
              width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: ${theme.accent.toString()};
            `}
          >
            <IconCheck />
          </div>
        </div>
        <div>
          <div
            css={css`
            ${textStyle("body1")}
            margin-bottom: ${0.5 * GU}px;
          `}
          >
            {`Your ${
              addressesEqual(account, caster) ? "" : "delegate's"
            } vote was cast successfully`}
          </div>
          <div
            css={css`
            ${textStyle("body2")}
            color: ${theme.surfaceContentSecondary.toString()};
          `}
          >
            {addressesEqual(account, caster) ? "You" : "Your delegate"} voted{" "}
            <span
              css={css`
                color: ${theme.surfaceContent.toString()};
                font-weight: 600;
                text-transform: uppercase;
              `}
            >
              {accountVote === VOTE_YEA ? "yes" : "no"}
            </span>{" "}
            with{" "}
            <span
              css={css`
                color: ${theme.surfaceContent.toString()};
                font-weight: 600;
              `}
            >
              {totalStake.eq(0)
                ? "…"
                : formatTokenAmount(totalStake, token.decimals)}{" "}
              {token.symbol}
            </span>
            .
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoteCasted;
