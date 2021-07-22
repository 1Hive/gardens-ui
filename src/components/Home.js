import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import GardensList from './GardensList'
import Onboarding from './Onboarding'
import LandingBanner from './LandingBanner'
import UnsupportedChainAnimation from './UnsupportedChainAnimation'
import { useWallet } from '@providers/Wallet'
import { useNodeHeight } from '@hooks/useNodeHeight'

// import { isSupportedChain } from '@/networks'

function Home() {
  const [height, ref] = useNodeHeight()
  const [onboardingVisible, setOnboardingVisible] = useState(false)
  const { supportedChain } = useWallet()

  console.log('HOMEEEEEEE')

  const handleOnboardingOpen = useCallback(() => {
    setOnboardingVisible(true)
  }, [])

  const handleOnboardingClose = useCallback(() => {
    setOnboardingVisible(false)
  }, [])

  return (
    <div>
      <LandingBanner ref={ref} onCreateGarden={handleOnboardingOpen} />
      <DynamicDiv marginTop={height}>
        {supportedChain ? <GardensList /> : <UnsupportedChainAnimation />}
      </DynamicDiv>
      <Onboarding onClose={handleOnboardingClose} visible={onboardingVisible} />
    </div>
  )
}

const DynamicDiv = styled.div.attrs(props => ({
  style: { marginTop: props.marginTop + 'px' },
}))``

export default Home
