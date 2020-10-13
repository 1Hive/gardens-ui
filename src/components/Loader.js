import React from 'react'
import Lottie from 'react-lottie'
import styled from 'styled-components'
import beeAnimation from '../assets/lotties/bee-animation.json'

const Wrapper = styled.div`
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 500px;
  width: 100%;
`

function Loader() {
  const defaultOptions = {
    animationData: beeAnimation,
  }

  return (
    <Wrapper>
      <Lottie options={defaultOptions} height={100} width={100} />
    </Wrapper>
  )
}

export default Loader
