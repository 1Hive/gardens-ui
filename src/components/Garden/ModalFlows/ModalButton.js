import React from "react";
import { Button, GU } from "@1hive/1hive-ui";
import LoadingSpinner from "@components/LoadingRing";

/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";

function ModalButton({ children, loading, ...props }) {
  return (
    <Button
      mode="strong"
      wide
      css={css`
        margin-top: ${2 * GU}px;
      `}
      {...props}
    >
      {loading && (
        <LoadingSpinner
          css={css`
            margin-right: ${1 * GU}px;
          `}
        />
      )}
      {loading ? "Loading…" : children}
    </Button>
  );
}

export default ModalButton;
