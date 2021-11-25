import React, { useMemo } from 'react'
import { useRouteMatch } from 'react-router'
import Lottie from 'react-lottie-player'
import styled from 'styled-components'

import beeAnimation from '@assets/lotties/bee-animation.json'
import gardensLoader from '@assets/lotties/gardens-loader.json'
import { HIVE_GARDEN_ADDRESSES } from '@/constants'
import { addressesEqual } from '@/utils/web3-utils'

const Wrapper = styled.div`
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`

function Loader() {
  const match = useRouteMatch('/garden/:daoId')

  const is1HiveGarden = useMemo(() => {
    if (match) {
      const gardenAddress = match.params.daoId
      return HIVE_GARDEN_ADDRESSES.reduce((isHive, current) => {
        return isHive || addressesEqual(gardenAddress, current)
      }, false)
    }

    return false
  }, [match])

  return (
    <Wrapper>
      <Lottie
        animationData={is1HiveGarden ? beeAnimation : gardensLoader}
        play
        loop
        style={{
          height: is1HiveGarden ? 100 : 150,
          width: is1HiveGarden ? 100 : 150,
        }}
      />
    </Wrapper>
  )
}

export default Loader
