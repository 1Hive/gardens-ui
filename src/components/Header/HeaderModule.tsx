import React from "react";
import {
  ButtonBase,
  GU,
  IconDown,
  useTheme,
  useViewport,
} from "@1hive/1hive-ui";

import { css, jsx } from "@emotion/react";

function HeaderModule({
  content,
  hasPopover = true,
  icon,
  onClick,
}: {
  content;
  hasPopover?: boolean;
  icon;
  onClick?: () => void;
}) {
  const { above } = useViewport();
  const theme = useTheme();

  return (
    <ButtonBase
      onClick={onClick}
      css={css`
        height: 100%;
        padding: ${1 * GU}px;
        background: ${theme.surface.toString()};
        &:active {
          background: ${theme.surfacePressed.toString()};
        }
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
          text-align: left;
          padding: 0 ${1 * GU}px;
        `}
      >
        <>
          {icon}
          {above("medium") && (
            <React.Fragment>
              <div
                css={css`
                  padding-left: ${1 * GU}px;
                  padding-right: ${0.5 * GU}px;
                `}
              >
                {content}
              </div>
              {hasPopover && (
                <IconDown size="small" color={theme.surfaceIcon.toString()} />
              )}
            </React.Fragment>
          )}
        </>
      </div>
    </ButtonBase>
  );
}

export default HeaderModule;
