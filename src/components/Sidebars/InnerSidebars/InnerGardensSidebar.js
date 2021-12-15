import React, { useMemo } from 'react'
import { animated, useTrail } from 'react-spring'
import { GU, Link, LoadingRing } from '@1hive/1hive-ui'
import defaultGardenLogo from '@assets/defaultGardenLogo.png'
import gardensLogo from '@assets/gardensLogoMark.svg'
import { addressesEqual, getNetworkType } from '@/utils/web3-utils'
import { useConnectedGarden } from '@/providers/ConnectedGarden'
import { useUserState } from '@/providers/User'
import { useGardens } from '@/providers/Gardens'
import { useWallet } from '@/providers/Wallet'
import GardenItem from '../Items/GardenItem'
import BaseInnerSidebar from './BaseInnerSidebar'

const InnerGardensSidebar = ({ disableAnimation = false, width, onToggle }) => {
  const { preferredNetwork } = useWallet()
  const { user: connectedUser, loading: userLoading } = useUserState()
  const { gardensMetadata } = useGardens()

  const connectedGarden = useConnectedGarden()
  const networkType = getNetworkType(
    connectedGarden?.chainId || preferredNetwork
  )

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
        path: `#/${networkType}/garden/${gardenSignedAddress}`,
        src: logo || defaultGardenLogo,
      }
    })

    return result
  }, [connectedUser, gardensMetadata, networkType])

  const startTrail = sidebarGardens.length > 0
  const gardensTrail = useTrail(sidebarGardens.length, {
    config: { mass: 5, tension: 1500, friction: 150 },
    opacity: startTrail ? 1 : 0,
    marginLeft: startTrail ? '0' : `-40px`,
    from: { marginLeft: `-40px`, opacity: 0 },
    delay: 400,
  })

  return (
    <BaseInnerSidebar
      width={width}
      topElement={
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
      }
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
          {disableAnimation
            ? sidebarGardens.map(({ address, name, path, src }) => (
                <GardenItem
                  active={
                    Boolean(connectedGarden) &&
                    addressesEqual(address, connectedGarden.address)
                  }
                  label={name || address}
                  path={path}
                  src={src}
                  onClick={onToggle}
                />
              ))
            : gardensTrail.map((style, index) => {
                const { address, name, path, src } = sidebarGardens[index]
                return (
                  <animated.div key={address} style={style}>
                    <GardenItem
                      active={
                        Boolean(connectedGarden) &&
                        addressesEqual(address, connectedGarden.address)
                      }
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
    </BaseInnerSidebar>
  )
}

export default InnerGardensSidebar
