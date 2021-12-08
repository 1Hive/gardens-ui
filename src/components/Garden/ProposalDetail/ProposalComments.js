import React from "react";
import { GU, Split, useLayout } from "@1hive/1hive-ui";
import DiscourseComments from "@/components/DiscourseComments";
/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";

function ProposalComments({ link }) {
  const { layoutName } = useLayout();

  // We take the last section of the link that includes the topicId
  const discourseTopicId = link.split("/").reverse()[0];

  return (
    <Split
      primary={
        link && (
          <div
            css={css`
              padding-left: ${layoutName !== "large" ? 2 * GU : 0}px;
            `}
          >
            <DiscourseComments topicId={discourseTopicId} />
          </div>
        )
      }
    />
  );
}

export default ProposalComments;
