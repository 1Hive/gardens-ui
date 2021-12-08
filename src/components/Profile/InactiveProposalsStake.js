import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { Box, GU, textStyle, useTheme, useViewport } from "@1hive/1hive-ui";
import { formatTokenAmount } from "@utils/token-utils";
/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";

function InactiveProposalsStake({ myInactiveStakes }) {
  const { below } = useViewport();
  const compact = below("large");
  const history = useHistory();

  const handleSelectProposal = useCallback(
    (gardenId, proposalId) => {
      history.push(`garden/${gardenId}/proposal/${proposalId}`);
    },
    [history]
  );
  return (
    <Box heading="Inactive proposals stake" padding={3 * GU}>
      {myInactiveStakes.map((stake) => {
        return (
          <ProposalItem
            amount={stake.amount}
            compact={compact}
            gardenId={stake.proposal.organization.id}
            proposalId={stake.proposal.id}
            proposalName={stake.proposal.metadata}
            selectProposal={handleSelectProposal}
          />
        );
      })}
    </Box>
  );
}

const ProposalItem = ({
  amount,
  compact,
  gardenId,
  proposalId,
  proposalName,
  selectProposal,
}) => {
  const theme = useTheme();

  const handleOnClick = useCallback(() => {
    selectProposal(gardenId, proposalId);
  }, [gardenId, proposalId, selectProposal]);

  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        margin-bottom: ${1 * GU}px;
      `}
    >
      <div
        css={css`
          width: ${1 * GU}px;
          height: ${1 * GU}px;
          border-radius: 50%;
          background: ${theme.disabled.toString()};
          margin-right: ${1 * GU}px;
          flex-shrink: 0;
        `}
      />
      <div
        css={css`
          display: flex;
          width: 100%;
          justify-content: space-between;
          align-items: center;
          ${textStyle("body2")};
        `}
      >
        <div
          css={css`
            background: ${theme.badge.toString()};
            border-radius: 3px;
            padding: ${0.5 * GU}px ${1 * GU}px;
            width: ${compact ? "100%" : `${18 * GU}px`};
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;

            ${proposalId &&
              `cursor: pointer; &:hover {
            background: ${theme.badge.alpha(0.7).toString()}
          }`}
          `}
          onClick={proposalId ? handleOnClick : null}
        >
          {proposalName}
        </div>
        <span
          css={css`
            margin-left: ${1 * GU}px;
          `}
        >
          {formatTokenAmount(amount, 18)}
        </span>
      </div>
    </div>
  );
};

export default InactiveProposalsStake;
