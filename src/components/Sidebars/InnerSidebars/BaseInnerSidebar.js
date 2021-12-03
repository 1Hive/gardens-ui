import React from 'react'
import { GU, useTheme } from '@1hive/1hive-ui'

const BaseInnerSidebar = ({ children, width, topElement }) => {
  const theme = useTheme()

  return (
    <div
      css={`
        height: inherit;
        width: ${width};
        background-color: ${theme.surface};
        border-right: 1px solid ${theme.border};
        box-shadow: 2px 0px 4px rgba(160, 168, 194, 0.16);
      `}
    >
      {topElement && (
        <div
          css={`
            padding: ${1.5 * GU}px ${2 * GU}px;
          `}
        >
          <div
            css={`
              padding-bottom: ${1.5 * GU}px;
              border-bottom: 1px solid ${theme.border};
            `}
          >
            {topElement}
          </div>
        </div>
      )}
      <nav
        css={`
          position: fixed;
          height: 100vh;
          overflow-y: scroll;
          width: 100%;
          pointer-events: none;
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
          &::-webkit-scrollbar {
            display: none;
          }
        `}
      >
        <div
          css={`
            width: ${width};
            display: flex;
            flex-direction: column;
            position: absolute;
            pointer-events: auto;
          `}
        >
          {children}
        </div>
      </nav>
    </div>
  )
}

export default BaseInnerSidebar
