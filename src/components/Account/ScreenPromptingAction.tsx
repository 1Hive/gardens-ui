import React from "react";
import { GU, textStyle, Link, useTheme } from "@1hive/1hive-ui";
import { getNetwork } from "@/networks";
import loadingRing from "./assets/loading-ring.svg";
import { css, jsx, keyframes } from "@emotion/react";

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

function AccountModuleActionScreen({ onCancel }: { onCancel?: () => void }) {
  const theme = useTheme();
  const { image, name } = getNetwork();

  return (
    <section
      css={css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: ${2 * GU}px;
        height: 100%;
      `}
    >
      <div
        css={css`
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        `}
      >
        <div
          css={css`
            position: relative;
            width: ${10.5 * GU}px;
            height: ${10.5 * GU}px;
          `}
        >
          <div
            css={css`
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: url(${loadingRing}) no-repeat 0 0;
              animation-duration: 1s;
              animation-iteration-count: infinite;
              animation-timing-function: linear;
              animation-name: ${spin};
              // prevents flickering on Firefox
              backface-visibility: hidden;
            `}
          />
          <div
            css={css`
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: 50% 50% / auto ${5 * GU}px no-repeat url(${image});
            `}
          />
        </div>
        <h1
          css={css`
            padding-top: ${2 * GU}px;
            ${textStyle("body1")};
            font-weight: 600;
          `}
        >
          {`Connecting to ${name} network`}
        </h1>
        <p
          css={css`
            width: ${36 * GU}px;
            color: ${theme.surfaceContentSecondary.toString()};
          `}
        >
          {`Create and/or switch to the ${name} network in your provider. You may be temporarily redirected to a new screen.`}
        </p>
      </div>
      <div
        css={css`
          flex-grow: 0;
        `}
      >
        {onCancel && <Link onClick={onCancel}>Cancel</Link>}
      </div>
    </section>
  );
}

export default React.memo(AccountModuleActionScreen);
