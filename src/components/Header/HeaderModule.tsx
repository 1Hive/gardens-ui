import React from 'react'
import {
  ButtonBase,
  GU,
  IconDown,
  useTheme,
  useViewport,
} from '@1hive/1hive-ui'

type HeaderModuleProps = {
  content: React.ReactNode
  hasPopover: boolean
  icon: string | React.ReactNode
  onClick?: () => void
}

function HeaderModule({
  content,
  hasPopover = true,
  icon,
  onClick,
}: HeaderModuleProps) {
  const { above } = useViewport()
  const theme = useTheme()

  return (
    <ButtonBase
      onClick={onClick}
      css={`
        height: 100%;
        padding: ${1 * GU}px;
        background: ${theme.surface};

        ${!!onClick
          ? `&:active { background: ${theme.surfacePressed}; }`
          : `cursor: auto;`}
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
                <IconDown size="small" color={theme.surfaceIcon} />
              )}
            </React.Fragment>
          )}
        </>
      </div>
    </ButtonBase>
  )
}

export default HeaderModule
