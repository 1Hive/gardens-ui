/** @jsxImportSource @emotion/react */
import React from "react";
import { GU, Help, Link, LoadingRing, useTheme } from "@1hive/1hive-ui";
import Balance from "../Balance";
import ProposalCountdown from "./ProposalCountdown";
import ProposalDescription from "./ProposalDescription";
import ProposalSupport from "./ProposalSupport";

import { ProposalTypes } from "@/types";
import { useGardenState } from "@providers/GardenState";
import { formatTokenAmount } from "@utils/token-utils";
import { css, jsx } from "@emotion/react";

function ProposalInfo({ loading, proposal, onSelectProposal }) {
  const theme = useTheme();
  const { config } = useGardenState();
  const { requestToken, stableToken } = config.conviction;
  const primaryToken = proposal.stable ? stableToken : requestToken;

  return (
    <div>
      <ProposalDescription
        proposal={proposal}
        onSelectProposal={onSelectProposal}
      />
      {proposal.type !== ProposalTypes.Decision && (
        <div
          css={css`
            display: flex;
            align-items: center;
            color: ${theme.contentSecondary.toString()};
            margin-bottom: ${2 * GU}px;
          `}
        >
          <span
            css={css`
              margin-right: ${1 * GU}px;
            `}
          >
            Request:
          </span>
          <Balance
            amount={proposal.requestedAmount}
            decimals={primaryToken.decimals}
            icon={primaryToken.icon}
            symbol={primaryToken.symbol}
          />
          {proposal.stable && (
            <>
              {loading ? (
                <LoadingRing />
              ) : (
                <div
                  css={css`
                    display: flex;
                    align-items: center;
                    color: ${theme.contentSecondary.toString()};
                    margin-left: ${0.5 * GU}px;
                  `}
                >
                  <span>≈</span>
                  <span
                    css={css`
                      margin: 0px ${0.5 * GU}px;
                    `}
                  >
                    {formatTokenAmount(
                      proposal.requestedAmountConverted,
                      requestToken.decimals
                    )}{" "}
                    {requestToken.symbol}
                  </span>
                  <Help hint="">
                    Converted to {requestToken.symbol} at time of execution. For
                    funding proposals denominated in {stableToken.symbol} to be
                    made successfully, this Garden's{" "}
                    <Link href="https://1hive.gitbook.io/gardens/garden-creators/price-oracle">
                      price oracle
                    </Link>{" "}
                    must be called consistently. Contact your Garden
                    administrator or development team if the proposal execution
                    transaction is continually failing or if the request stable
                    amount is not accurate.
                  </Help>
                </div>
              )}
            </>
          )}
        </div>
      )}
      <ProposalSupport proposal={proposal} />
      {proposal.type === ProposalTypes.Decision && (
        <ProposalCountdown proposal={proposal} />
      )}
    </div>
  );
}

export default ProposalInfo;
