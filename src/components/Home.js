import React from 'react'
import styled from 'styled-components'
import GardensList from './GardensList'
import LandingBanner from './LandingBanner'
import { useNodeHeight } from '@hooks/useNodeHeight'

function Home() {
  const [height, ref] = useNodeHeight()

  return (
    <div>
      <LandingBanner ref={ref} />
      <DynamicDiv marginTop={height}>
        <GardensList />
      </DynamicDiv>
    </div>
  )
}

const DynamicDiv = styled.div.attrs(props => ({
  style: { marginTop: props.marginTop + 'px' },
}))``

export default Home
