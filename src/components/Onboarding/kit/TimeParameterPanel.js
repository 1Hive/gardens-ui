import React from "react";
import { Box, GU, textStyle } from "@1hive/1hive-ui";
import { DurationFields } from ".";

import { css, jsx } from "@emotion/react";

const TimeParameterPanel = ({ title, description, value, onUpdate }) => {
  return (
    <div
      css={css`
        display: flex;
        justify-content: center;
        align-items: center;
        padding: ${GU * 4}px;
      `}
    >
      <Box
        css={css`
          width: 60%;
          margin-right: ${GU * 6}px;
        `}
      >
        <div
          css={css`
            ${textStyle("title3")};
            margin-bottom: ${GU}px;
          `}
        >
          {title}
        </div>
        <div>{description}</div>
      </Box>

      <div
        css={css`
          width: 24%;
        `}
      >
        <DurationFields
          duration={value}
          onUpdate={onUpdate}
          direction="column"
        />
      </div>
    </div>
  );
};

export default TimeParameterPanel;
