import React, { useState, useCallback } from "react";
import {
  Button,
  ButtonBase,
  Link,
  GU,
  IconDown,
  RADIUS,
  textStyle,
  useTheme,
} from "@1hive/1hive-ui";
import { css, jsx } from "@emotion/react";

const SUPPORT_URL = "https://github.com/1hive/gardens/issues/new";

type GenericErrorProps = {
  detailsTitle: string;
  detailsContent: string;
  reportCallback?: () => void;
};

const GenericError = React.memo(function({
  detailsTitle,
  detailsContent,
  reportCallback,
}: GenericErrorProps) {
  const theme = useTheme();
  const [opened, setOpened] = useState(false);
  const toggle = useCallback(() => {
    setOpened(!opened);
  }, [opened, setOpened]);

  return (
    <React.Fragment>
      <h1
        css={css`
          color: ${theme.surfaceContent.toString()};
          ${textStyle("title2")};
          margin-bottom: ${1.5 * GU}px;
          text-align: center;
        `}
      >
        An unexpected error has occurred
      </h1>
      <p
        css={css`
          margin-bottom: ${5 * GU}px;
          text-align: center;
          color: ${theme.surfaceContentSecondary.toString()};
          ${textStyle("body2")};
        `}
      >
        Something went wrong! You can restart the app, or you can{" "}
        <Link href={SUPPORT_URL}>tell us what went wrong</Link> if the problem
        persists
      </p>
      {(detailsTitle || detailsContent) && (
        <div
          css={css`
            text-align: left;
            margin-bottom: ${5 * GU}px;
          `}
        >
          <ButtonBase
            onClick={toggle}
            css={css`
              display: flex;
              align-items: center;
              color: ${theme.surfaceContentSecondary.toString()};
              ${textStyle("label2")};
            `}
          >
            Click here to see more details
            <IconDown
              size="tiny"
              css={css`
                margin-left: ${0.5 * GU}px;
                transition: transform 150ms ease-in-out;
                transform: rotate3d(0, 0, 1, ${opened ? 180 : 0}deg);
              `}
            />
          </ButtonBase>
          {opened && (
            <div
              css={css`
                overflow: auto;
                padding: ${2 * GU}px;
                max-height: 200px;
                border-radius: ${RADIUS}px;
                color: ${theme.text.toString()};
                white-space: pre;
                background: ${theme.surfaceUnder.toString()};
                ${textStyle("body3")};
              `}
            >
              {detailsTitle && (
                <h2
                  css={css`
                    ${textStyle("body2")};
                    margin-bottom: ${1.5 * GU}px;
                  `}
                >
                  {detailsTitle}
                </h2>
              )}
              {detailsContent}
            </div>
          )}
        </div>
      )}
      <div
        css={css`
          ${reportCallback
            ? `
              display: flex;
              justify-content: flex-end;
            `
            : ""}
        `}
      >
        {reportCallback && (
          <Button onClick={reportCallback}>Send Report</Button>
        )}
        <Button
          mode="strong"
          onClick={() => window.location.reload()}
          wide={!reportCallback}
          css={css`
            margin-left: ${reportCallback ? 1.5 * GU : 0}px;
          `}
        >
          Reload
        </Button>
      </div>
    </React.Fragment>
  );
});

export default GenericError;
