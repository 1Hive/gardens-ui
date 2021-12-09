import React from "react";
import { GU, textStyle, useTheme } from "@1hive/1hive-ui";
import { getRelativeTime } from "@utils/date-utils";
import useNow from "@hooks/useNow";
import { css, jsx } from "@emotion/react";

function TimeTag({ date, label, ...props }: { date: number; label? }) {
  const theme = useTheme();
  const now = useNow();

  return (
    <div
      css={css`
        max-width: ${15.75 * GU}px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: ${theme.surfaceContentSecondary.toString()};
        ${textStyle("label2")};
      `}
      {...props}
    >
      {label || getRelativeTime(now, date)}
    </div>
  );
}

export default TimeTag;
