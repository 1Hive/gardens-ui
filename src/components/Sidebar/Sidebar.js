import React, { useMemo, useRef } from 'react'
import { useRouteMatch } from 'react-router'
import {
  animated,
  config,
  useChain,
  useTrail,
  useTransition,
} from 'react-spring'
import { GU, Link, useTheme, useViewport } from '@1hive/1hive-ui'
import LoadingRing from '../LoadingRing'
import MenuItem from './MenuItem'
import { useGardens } from '@providers/Gardens'
import { useUserState } from '@providers/User'

import { addressesEqual } from '@utils/web3-utils'
import gardensLogo from '@assets/gardensLogoMark.svg'
import defaultGardenLogo from '@assets/defaultGardenLogo.png'

const SIDEBAR_WIDTH = `${9 * GU}px`

function Sidebar({ show, onToggle }) {
  const theme = useTheme()
  const { user: connectedUser, loading: userLoading } = useUserState()
  const { gardensMetadata } = useGardens()
  const { below } = useViewport()
  const mobileMode = below('medium')

  const match = useRouteMatch('/garden/:daoId')

  const sidebarGardens = useMemo(() => {
    if (!connectedUser?.gardensSigned) {
      return []
    }

    const result = connectedUser.gardensSigned.map(gardenSignedAddress => {
      const { name, logo } =
        gardensMetadata?.find(g =>
          addressesEqual(g.address, gardenSignedAddress)
        ) || {}

      return {
        address: gardenSignedAddress,
        name,
        path: `/garden/${gardenSignedAddress}`,
        src: logo || defaultGardenLogo,
      }
    })

    return result
  }, [connectedUser, gardensMetadata])

  const isSidebarReady = show && sidebarGardens.length > 0
  const sidebarRef = useRef()
  const trailRef = useRef()

  const transition = useTransition(show, null, {
    from: {
      marginLeft: `-${SIDEBAR_WIDTH}`,
      opacity: 0,
    },
    enter: {
      marginLeft: '0',
      opacity: 1,
    },
    leave: {
      marginLeft: `-${SIDEBAR_WIDTH}`,
      opacity: 0,
    },
    immediate: !mobileMode,
    unique: true,
    config: config.stiff,
    ref: sidebarRef,
  })

  const trail = useTrail(isSidebarReady, {
    config: { mass: 5, tension: 1500, friction: 150 },
    opacity: isSidebarReady ? 1 : 0,
    marginLeft: isSidebarReady ? '0' : '-40px',
    from: { marginLeft: '-40px', opacity: 0 },
    ref: trailRef,
  })

  useChain(show ? [sidebarRef, trailRef] : [sidebarRef, trailRef])

  return transition.map(({ item, key, props }) =>
    item ? (
      <animated.div
        key={key}
        css={`
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          z-index: 2;
          width: ${SIDEBAR_WIDTH};
          flex-shrink: 0;
          background: ${theme.surface};
          border-right: 1px solid ${theme.border};
          box-shadow: 2px 0px 4px rgba(160, 168, 194, 0.16);
        `}
        style={props}
      >
        {mobileMode && (
          <animated.div
            css={`
              // border: 1px solid red;
              position: fixed;
              top: 0;
              left: ${SIDEBAR_WIDTH};
              right: 0;
              bottom: 0;
              background: ${theme.overlay.alpha(0.6)};
            `}
            style={props}
            onClick={onToggle}
          />
        )}
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
            // border: 1px solid black;
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
                {!!sidebarGardens.length &&
                  trail.map((style, index) => {
                    const { address, name, path, src } = sidebarGardens[index]
                    return (
                      <animated.div key={address} style={style}>
                        <MenuItem
                          active={addressesEqual(address, match?.params.daoId)}
                          label={name || address}
                          path={path}
                          src={src}
                          onClick={onToggle}
                        />
                      </animated.div>
                    )
                  })}
              </ul>
            )}
          </div>
        </nav>
      </animated.div>
    ) : null
  )
}

export default Sidebar
