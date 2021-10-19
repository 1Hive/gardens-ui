import React, { useMemo } from 'react'
import { useTrail, animated } from 'react-spring'
import { GU, Link, useTheme } from '@1hive/1hive-ui'
import gardensLogo from '@assets/gardensLogoMark.svg'
import defaultGardenLogo from '@assets/defaultGardenLogo.png'
import useUser from '@/hooks/useUser'
import { useGardens } from '@/providers/Gardens'
import { useWallet } from '@/providers/Wallet'
import { addressesEqual } from '@/utils/web3-utils'
import LoadingRing from '../LoadingRing'
import MenuItem from './MenuItem'

function Sidebar() {
  const theme = useTheme()
  const { account } = useWallet()
  const [connectedUser, userLoading] = useUser(account)
  const { connectedGarden, gardens } = useGardens()
  const sidebarGardens = useMemo(() => {
    if (!gardens || !connectedUser?.gardensSigned) {
      return []
    }

    return connectedUser.gardensSigned.map(gardenSignedAddress => {
      const { address, name, logo } = gardens.find(g =>
        addressesEqual(g.address, gardenSignedAddress)
      )
      return {
        address,
        name,
        path: `#/garden/${address}`,
        src: logo || defaultGardenLogo,
      }
    })
  }, [gardens, connectedUser])
  const startTrail = sidebarGardens.length > 0
  const trail = useTrail(sidebarGardens.length, {
    config: { mass: 5, tension: 2300, friction: 150 },
    opacity: startTrail ? 1 : 0,
    left: startTrail ? '0' : '-40px',
    from: { left: '-40px', opacity: 0 },
  })

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
      <nav
        css={`
          height: 100vh;
          overflow-y: scroll;
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
          &::-webkit-scrollbar {
            display: none;
          }
        `}
      >
        {userLoading ? (
          <div
            css={`
              display: flex;
              justify-content: center;
              margin-top: ${6 * GU}px;
            `}
          >
            <LoadingRing mode="half-circle" />
          </div>
        ) : (
          <div>
            <ul>
              {trail.map((style, index) => {
                const { address, name, path, src } = sidebarGardens[index]
                return (
                  <animated.div
                    key={sidebarGardens[index].address}
                    style={{ position: 'relative', ...style }}
                  >
                    <MenuItem
                      active={addressesEqual(address, connectedGarden?.address)}
                      name={name}
                      path={path}
                      src={src}
                    />
                  </animated.div>
                )
              })}
            </ul>
          </div>
        )}
      </nav>
    </div>
  )
}

export default Sidebar
