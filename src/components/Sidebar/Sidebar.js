import React from 'react'
import { GU, useTheme, Link } from '@1hive/1hive-ui'
import gardensLogo from '@assets/gardensLogoMark.svg'

function Sidebar() {
  const theme = useTheme()

  return (
    <div
      css={`
        z-index: 1;
        width: ${9 * GU}px;
        flex-shrink: 0;
        background: ${theme.surface};
        border-right: 1px solid ${theme.border};
        box-shadow: 2px 0px 4px rgba(160, 168, 194, 0.16);
        height: 64px;
      `}
    >
      <div
        css={`
          padding: ${1.5 * GU}px ${2 * GU}px;
        `}
      >
        <div
          css={`
            display: flex;
            padding-bottom: ${1.5 * GU}px;
            border-bottom: 1px solid ${theme.border};
          `}
        >
          <Link
            href="#/home"
            external={false}
            css={`
              display: block;
            `}
          >
            <img
              src={gardensLogo}
              height={40}
              alt=""
              css={`
                display: block;
              `}
            />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
