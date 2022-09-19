import React, { useRef, useState, useCallback } from 'react'
import {
  ButtonBase,
  ButtonIcon,
  GU,
  IconConfiguration,
  IconExternal,
  IconSettings,
  Popover,
  RADIUS,
  Switch,
  textStyle,
  useTheme,
  useViewport,
} from '@1hive/1hive-ui'
import { useAppTheme } from '@providers/AppTheme'

import darkModeIconLight from '@images/icons/base/icon-dark-mode-light.svg'
import darkModeIconDark from '@images/icons/dark-mode/icon-dark-mode-dark.svg'

function GlobalPreferencesButton({ onOpen }) {
  const theme = useTheme()
  const { below } = useViewport()
  const AppTheme = useAppTheme()

  const [opened, setOpened] = useState(false)
  const containerRef = useRef()

  const toggleDarkMode = useCallback(() => {
    AppTheme.toggleAppearance()
  }, [AppTheme])

  const handleToggle = useCallback(() => setOpened((opened) => !opened), [])
  const handleClose = useCallback(() => setOpened(false), [])
  const handleItemClick = useCallback(
    (path) => () => {
      setOpened(false)
      onOpen(path)
    },
    [onOpen]
  )

  return (
    <React.Fragment>
      <div ref={containerRef}>
        <ButtonIcon
          element="div"
          onClick={handleToggle}
          label="Global preferences"
          css={`
            width: ${4.25 * GU}px;
            height: 100%;
            border-radius: 0;
          `}
        >
          <IconSettings color={theme.hint} />
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
          css={`
            /* Use 20px as the padding setting for popper is 10px */
            width: ${below('medium') ? `calc(100vw - 20px)` : `${42 * GU}px`};
            padding: 0;
            margin: 0;
            list-style: none;
            background: ${theme.surface};
            color: ${theme.content};
            border-radius: ${RADIUS}px;
          `}
        >
          <li
            css={`
              display: flex;
              align-items: center;
              height: ${4 * GU}px;
              padding-left: ${2 * GU}px;
              border-bottom: 1px solid ${theme.border};
              ${textStyle('label2')};
              color: ${theme.surfaceContentSecondary};
            `}
          >
            Global preferences
          </li>
          <Item
            onClick={handleItemClick('generalInfo')}
            Icon={IconConfiguration}
            label="Settings"
          />
          <Item
            onClick={toggleDarkMode}
            icon={AppTheme.appearance === 'dark'? darkModeIconDark : darkModeIconLight }
            label={
              <React.Fragment>
                <div
                  css={`
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                  `}
                >
                  <span>Dark mode</span>
                  <Switch checked={AppTheme.appearance === 'dark'} />
                </div>
              </React.Fragment>
            }
          />
          <Item href="https://1hive.gitbook.io/gardens/">
            <div
              css={`
                flex-grow: 1;
                display: flex;
                align-items: center;
                margin-right: ${1 * GU}px;
              `}
            >
              Any questions? Visit our wiki
            </div>
            <div
              css={`
                color: ${theme.surfaceContentSecondary};
              `}
            >
              <IconExternal />
            </div>
          </Item>
        </ul>
      </Popover>
    </React.Fragment>
  )
}

function Item({ children, icon, label, onClick, href }) {
  const theme = useTheme()
  return (
    <li
      css={`
        & + & {
          border-top: 1px solid ${theme.border};
        }
      `}
    >
      <ButtonBase
        onClick={onClick}
        label={label}
        external={Boolean(href)}
        href={href}
        css={`
          width: 100%;
          height: ${7 * GU}px;
          border-radius: 0;
        `}
      >
        <div
          css={`
            display: flex;
            width: 100%;
            height: 100%;
            padding: ${2 * GU}px;
            justify-content: left;
            align-items: center;

            &:active,
            &:focus {
              background: ${theme.surfacePressed};
            }
          `}
        >
          {children || (
            <>
              {icon && <img src={icon} alt="" />}
              <div
                css={`
                  flex-grow: 1;
                  display: flex;
                  align-items: center;
                  margin-left: ${icon ? 1 * GU : 0}px;
                `}
              >
                {label}
              </div>
            </>
          )}
        </div>
      </ButtonBase>
    </li>
  )
}

export default React.memo(GlobalPreferencesButton)
