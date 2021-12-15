import React from 'react'
import Lottie from 'react-lottie-player'
import styled from 'styled-components'
import { useGardenRoute } from '@hooks/useRouting'
import { getNetworkChainIdByType } from '@/networks'
import { is1HiveGarden } from '@utils/garden-utils'

import beeAnimation from '@assets/lotties/bee-animation.json'
import gardensLoader from '@assets/lotties/gardens-loader.json'

const Wrapper = styled.div`
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`

export function GardenLoader() {
  return (
    <div
      css={`
        position: absolute;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -50%);
        height: 100%;
      `}
    >
      <Loader />
    </div>
  )
}

function Loader() {
  const [networkType, gardenAddress] = useGardenRoute()
  const chainId = getNetworkChainIdByType(networkType)
  const is1Hive = is1HiveGarden(gardenAddress, chainId)

  return (
    <Wrapper>
      <Lottie
        animationData={is1Hive ? beeAnimation : gardensLoader}
        play
        loop
        style={{
          height: is1Hive ? 100 : 150,
          width: is1Hive ? 100 : 150,
        }}
      />
    </Wrapper>
  )
}

export default Loader
