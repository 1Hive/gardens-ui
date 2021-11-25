import React, { useMemo } from 'react'
import { useRouteMatch } from 'react-router'
import Lottie from 'react-lottie-player'
import styled from 'styled-components'

import beeAnimation from '@assets/lotties/bee-animation.json'
import gardensLoader from '@assets/lotties/gardens-loader.json'
import { HIVE_GARDEN_ADDRESS } from '@/constants'

const Wrapper = styled.div`
  pointer-events: none;
  position: fixed;
  top: 45%;
  left: 45%;
`

function Loader() {
  const match = useRouteMatch('/garden/:daoId')

  const is1HiveGarden = useMemo(() => {
    if (match) {
      const gardenAddress = match.params.daoId
      return gardenAddress === HIVE_GARDEN_ADDRESS
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
