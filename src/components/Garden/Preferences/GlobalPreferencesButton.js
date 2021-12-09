import React, { useRef, useState, useCallback } from "react";
import {
  ButtonBase,
  ButtonIcon,
  GU,
  IconConfiguration,
  IconExternal,
  IconSettings,
  Popover,
  RADIUS,
  textStyle,
  useTheme,
  useViewport,
} from "@1hive/1hive-ui";

import { css, jsx } from "@emotion/react";

function GlobalPreferencesButton({ onOpen }) {
  const theme = useTheme();
  const { below } = useViewport();

  const [opened, setOpened] = useState(false);
  const containerRef = useRef();

  const handleToggle = useCallback(() => setOpened((opened) => !opened), []);
  const handleClose = useCallback(() => setOpened(false), []);
  const handleItemClick = useCallback(
    (path) => () => {
      setOpened(false);
      onOpen(path);
    },
    [onOpen]
  );

  return (
    <React.Fragment>
      <div
        ref={containerRef}
        css={css`
          display: flex;
          align-items: center;
        `}
      >
        <ButtonIcon
          element="div"
          onClick={handleToggle}
          label="Global preferences"
          css={css`
            width: ${4.25 * GU}px;
            height: 100%;
            border-radius: 0;
          `}
        >
          <IconSettings color={theme.hint.toString()} />
        </ButtonIcon>
      </div>
      <Popover
        closeOnOpenerFocus
        placement="bottom-end"
        onClose={handleClose}
        visible={opened}
        opener={containerRef.current}
      >
        <ul
          css={css`
            /* Use 20px as the padding setting for popper is 10px */
            width: ${below("medium") ? `calc(100vw - 20px)` : `${42 * GU}px`};
            padding: 0;
            margin: 0;
            list-style: none;
            background: ${theme.surface.toString()};
            color: ${theme.content.toString()};
            border-radius: ${RADIUS}px;
          `}
        >
          <li
            css={css`
              display: flex;
              align-items: center;
              height: ${4 * GU}px;
              padding-left: ${2 * GU}px;
              border-bottom: 1px solid ${theme.border.toString()};
              ${textStyle("label2")};
              color: ${theme.surfaceContentSecondary.toString()};
            `}
          >
            Global preferences
          </li>
          <Item
            onClick={handleItemClick("generalInfo")}
            Icon={IconConfiguration}
            label="Settings"
          />
          <Item href="https://1hive.gitbook.io/gardens/">
            <div
              css={css`
                flex-grow: 1;
                display: flex;
                align-items: center;
                margin-right: ${1 * GU}px;
              `}
            >
              Any questions? Visit our wiki
            </div>
            <div
              css={css`
                color: ${theme.surfaceContentSecondary.toString()};
              `}
            >
              <IconExternal />
            </div>
          </Item>
        </ul>
      </Popover>
    </React.Fragment>
  );
}

function Item({ children, Icon, label, onClick, href }) {
  const theme = useTheme();
  return (
    <li
      css={css`
        & + & {
          border-top: 1px solid ${theme.border.toString()};
        }
      `}
    >
      <ButtonBase
        onClick={onClick}
        label={label}
        external={Boolean(href)}
        href={href}
        css={css`
          width: 100%;
          height: ${7 * GU}px;
          border-radius: 0;
        `}
      >
        <div
          css={css`
            display: flex;
            width: 100%;
            height: 100%;
            padding: ${2 * GU}px;
            justify-content: left;
            align-items: center;

            &:active,
            &:focus {
              background: ${theme.surfacePressed.toString()};
            }
          `}
        >
          {children || (
            <>
              <Icon />
              <div
                css={css`
                  flex-grow: 1;
                  display: flex;
                  align-items: center;
                  margin-left: ${Icon ? 1 * GU : 0}px;
                `}
              >
                {label}
              </div>
            </>
          )}
        </div>
      </ButtonBase>
    </li>
  );
}

export default React.memo(GlobalPreferencesButton);
