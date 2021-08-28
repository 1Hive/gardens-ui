import React from 'react'
import { GU, useTheme, Link } from '@1hive/1hive-ui'
import gardensLogo from '@assets/gardensLogoMark.svg'
import MenuItem from './MenuItem'

function Sidebar({ gardens, activeGarden, onOpen }) {
  const theme = useTheme()
  return (
    <div
      css={`
        width: ${9 * GU}px;
        flex-shrink: 0;
        background: ${theme.surface};
        border-right: 1px solid ${theme.border};
        box-shadow: 2px 0 3px rgba(0, 0, 0, 0.05);
      `}
    >
      <div
        css={`
          padding: ${2 * GU}px;
          padding-bottom: ${1 * GU}px;
        `}
      >
        <Link href="#/home" external={false}>
          <div
            css={`
              border-bottom: 1px solid ${theme.border};
            `}
          >
            <img src={gardensLogo} height={40} alt="" />
          </div>
        </Link>
      </div>
      <nav>
        <ul>
          {gardens.map((garden, i) => (
            <MenuItem
              key={garden.path}
              active={garden.address === activeGarden}
              path={garden.path}
              name={garden.name}
              src={garden.src}
              onOpen={onOpen}
            />
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar
