import React from "react";

/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";

function LayoutLimiter({ children, ...props }) {
  return (
    <div
      css={css`
        margin-left: auto;
        margin-right: auto;
        max-width: 1280px;
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export default LayoutLimiter;
