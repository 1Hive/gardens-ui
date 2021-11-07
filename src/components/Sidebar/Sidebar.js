import React, { useMemo } from 'react'
import { useTrail, animated } from 'react-spring'
import { GU, Link, useTheme } from '@1hive/1hive-ui'
import LoadingRing from '../LoadingRing'
import MenuItem from './MenuItem'
import { useGardens } from '@providers/Gardens'
import { useUserState } from '@providers/User'

import { addressesEqual } from '@utils/web3-utils'
import gardensLogo from '@assets/gardensLogoMark.svg'
import defaultGardenLogo from '@assets/defaultGardenLogo.png'

function Sidebar() {
  const theme = useTheme()
  const { user: connectedUser, loading: userLoading } = useUserState()
  const { connectedGarden, gardensMetadata } = useGardens()

  const sidebarGardens = useMemo(() => {
    if (!connectedUser?.gardensSigned || !gardensMetadata) {
      return []
    }

    const result = connectedUser.gardensSigned.map(gardenSignedAddress => {
      const { address, name, logo } = gardensMetadata.find(g =>
        addressesEqual(g.address, gardenSignedAddress)
      )
      return {
        address,
        name,
        path: `#/garden/${address}`,
        src: logo || defaultGardenLogo,
      }
    })

    return result
  }, [connectedUser, gardensMetadata])

  const startTrail = sidebarGardens.length > 0
  const trail = useTrail(sidebarGardens.length, {
    config: { mass: 5, tension: 1500, friction: 150 },
    delay: 300,
    opacity: startTrail ? 1 : 0,
    marginLeft: startTrail ? '0' : '-40px',
    from: { marginLeft: '-40px', opacity: 0 },
  })

  return (
    <div
      css={`
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        z-index: 2;
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
            display: flex;
            flex-direction: column;
            position: absolute;
            pointer-events: auto;
          `}
        >
          {userLoading ? (
            <div
              css={`
                margin-top: ${6 * GU}px;
                margin-left: ${2 * GU}px;
              `}
            >
              <LoadingRing mode="half-circle" />
            </div>
          ) : (
            <ul>
              {trail.map((style, index) => {
                const { address, name, path, src } = sidebarGardens[index]
                return (
                  <animated.div key={address} style={style}>
                    <MenuItem
                      active={addressesEqual(address, connectedGarden?.address)}
                      label={name || address}
                      path={path}
                      src={src}
                    />
                  </animated.div>
                )
              })}
            </ul>
          )}
        </div>
      </nav>
    </div>
  )
}

export default Sidebar
