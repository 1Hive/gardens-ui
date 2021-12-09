import React from "react";
import { Card, GU, useViewport, useTheme } from "@1hive/1hive-ui";
import flowerError from "../../assets/flowerError.svg";
import { css, jsx } from "@emotion/react";

function GlobalErrorScreen({ children }: { children: React.ReactNode }) {
  return (
    <div
      css={css`
        height: 100vh;
        min-width: ${45 * GU}px;
        overflow: auto;
        background-repeat: repeat-x;
        background-size: cover;
        border-top-style: solid;
        border-top-width: 4px;
        border-top-color: #6050b0;
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: center;
          align-items: center;
          padding: ${8 * GU}px;
          min-height: 100%;
        `}
      >
        <Container>
          <img
            src={flowerError}
            alt=""
            css={css`
              display: block;
              margin: 0px auto 0px;
            `}
          />
          {children}
        </Container>
      </div>
    </div>
  );
}

function Container({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const { width } = useViewport();

  return width < 60 * GU ? (
    <div
      css={css`
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        min-width: ${45 * GU}px;
        overflow: auto;
        background: ${theme.surface.toString()};
        display: grid;
        align-items: center;
      `}
    >
      <div
        css={css`
          padding: ${5 * GU}px ${6 * GU}px ${6 * GU}px;
        `}
      >
        {children}
      </div>
    </div>
  ) : (
    <Card
      css={css`
        display: block;
        padding: ${5 * GU}px ${6 * GU}px;
        width: 100%;
        max-width: ${72 * GU}px;
        height: auto;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        cursor: unset;
      `}
    >
      {children}
    </Card>
  );
}

export default GlobalErrorScreen;
