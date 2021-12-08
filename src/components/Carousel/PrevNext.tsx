/** @jsxImportSource @emotion/react */
import React from "react";
import { GU, ButtonIcon, IconRight, IconLeft, useTheme } from "@1hive/1hive-ui";
import { css, jsx } from "@emotion/react";

function PrevNext({
  onClick,
  type,
}: {
  onClick: () => void;
  type: "next" | "previous";
}) {
  const theme = useTheme();
  const next = type === "next";
  const Icon = next ? IconRight : IconLeft;

  let directionStyle = next
    ? css`
        right: ${0.5 * GU}px;
      `
    : css`
        left: ${0.5 * GU}px;
      `;

  return (
    <ButtonIcon
      onClick={onClick}
      label={next ? "Next" : "Previous"}
      css={css`
        position: absolute !important;
        z-index: 1;
        top: calc(50% - ${3 * GU}px);
        height: ${6 * GU}px !important;
        color: ${theme.surfaceContentSecondary.toString()};
        ${directionStyle}
      `}
    >
      <Icon size="large" />
    </ButtonIcon>
  );
}

export default PrevNext;
