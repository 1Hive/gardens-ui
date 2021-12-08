import React from "react";
import { GU, IconCross, useTheme } from "@1hive/1hive-ui";
import Screens from "./Screens";
import StepsPanel from "./Steps/StepsPanel";

import gardensLogo from "@assets/gardensLogoMark.svg";
/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";

function Setup({ onClose }) {
  const theme = useTheme();

  return (
    <>
      <div
        css={css`
          width: ${41 * GU}px;
          flex-shrink: 0;
          flex-grow: 0;
        `}
      >
        <img
          css={css`
            display: flex;
            padding-left: ${2.25 * GU}px;
            margin-top: ${2 * GU}px;
          `}
          src={gardensLogo}
          height={32}
          alt=""
        />
        <StepsPanel />
      </div>
      <div
        css={css`
          width: 100%;
          flex-grow: 1;
          flex-shrink: 1;
          background: #f9f9f8;
        `}
      >
        <div
          css={css`
            padding: ${3 * GU}px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          `}
        >
          <div />
          <div
            css={css`
              cursor: pointer;
            `}
            onClick={onClose}
          >
            <IconCross color={theme.surfaceIcon.toString()} />
          </div>
        </div>
        <div
          css={css`
            overflow-y: auto;
            height: calc(100vh - 127px);
          `}
        >
          <section
            css={css`
              margin: 0px auto;
              max-width: 950px;
              padding: 0px 24px 48px;
            `}
          >
            <div
              css={css`
                display: flex;
                flex-direction: column;
              `}
            >
              <Screens />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Setup;
