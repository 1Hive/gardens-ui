import React from "react";
import { GU, textStyle, useTheme } from "@1hive/1hive-ui";
import ProposalIcon from "@components/ProposalIcon";
import { dateFormat } from "@utils/date-utils";
import { convertToString } from "@/types";
/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";

function ProposalHeader({ proposal }) {
  const theme = useTheme();
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        margin-bottom: ${2 * GU}px;
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
        `}
      >
        <ProposalIcon type={proposal.type} />
        <span
          css={css`
            margin-left: ${0.5 * GU}px;
          `}
        >
          {convertToString(proposal.type)}
        </span>
      </div>
      <div
        css={css`
          ${textStyle("body3")};
          color: ${theme.contentSecondary.toString()};
          margin-left: ${1 * GU}px;
        `}
      >
        {dateFormat(proposal.createdAt, "custom")}
      </div>
    </div>
  );
}

export default ProposalHeader;
