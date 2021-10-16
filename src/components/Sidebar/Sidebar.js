import React, { useMemo } from 'react'
import { GU, useTheme, Link } from '@1hive/1hive-ui'
import gardensLogo from '@assets/gardensLogoMark.svg'
import defaultGardenLogo from '@assets/defaultGardenLogo.png'
import MenuItem from './MenuItem'
import { useGardens } from '@/providers/Gardens'

function Sidebar() {
  const theme = useTheme()
  const { connectedGarden, gardens } = useGardens()

  const gardenData = useMemo(
    () =>
      gardens
        .map(garden => {
          return {
            name: garden.name,
            address: garden.address,
            path: `#/garden/${garden.address}`,
            src: garden.logo || defaultGardenLogo,
          }
        })
        .filter(garden => garden.address === connectedGarden.address),
    [connectedGarden, gardens]
  )

  return (
    <div
      css={`
        z-index: 1;
        width: ${9 * GU}px;
        flex-shrink: 0;
        background: ${theme.surface};
        border-right: 1px solid ${theme.border};
        box-shadow: 2px 0px 4px rgba(160, 168, 194, 0.16);
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
      <nav>
        <ul>
          {gardenData.map((garden, i) => (
            <MenuItem
              key={garden.address}
              active={garden.address === connectedGarden.address}
              path={garden.path}
              name={garden.name}
              src={garden.src}
            />
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar
