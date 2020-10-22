import React from 'react'
import {
  ButtonBase,
  GU,
  IconDown,
  useTheme,
  useViewport,
} from '@1hive/1hive-ui'
function HeaderModule({ content, hasPopover = true, icon, onClick }) {
  const { above } = useViewport()
  const theme = useTheme()

  return (
    <ButtonBase
      onClick={onClick}
      css={`
        height: 100%;
        padding: ${1 * GU}px;
        background: ${theme.surface};
        &:active {
          background: ${theme.surfacePressed};
        }
      `}
    >
      <div
        css={`
          display: flex;
          align-items: center;
          text-align: left;
          padding: 0 ${1 * GU}px;
        `}
      >
        <>
          {icon}
          {above('medium') && (
            <React.Fragment>
              <div
                css={`
                  padding-left: ${1 * GU}px;
                  padding-right: ${0.5 * GU}px;
                `}
              >
                {content}
              </div>
              {hasPopover && (
                <IconDown
                  size="small"
                  css={`
                    color: ${theme.surfaceIcon};
                  `}
                />
              )}
            </React.Fragment>
          )}
        </>
      </div>
    </ButtonBase>
  )
}

export default HeaderModule
