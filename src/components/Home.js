import { useToast } from '@1hive/1hive-ui'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'

import { useNodeHeight } from '@hooks/useNodeHeight'

import GardensList from './GardensList'
import Onboarding from './Onboarding'
import LandingBanner from './LandingBanner'

function Home() {
  const [height, ref] = useNodeHeight()
  const [onboardingVisible, setOnboardingVisible] = useState(false)
  const toast = useToast()

  const handleOnboardingOpen = useCallback(() => {
    setOnboardingVisible(true)
  }, [])

  const handleOnboardingClose = useCallback(() => {
    setOnboardingVisible(false)
    toast('Progress saved')
  }, [toast])

  return (
    <div>
      <LandingBanner ref={ref} onCreateGarden={handleOnboardingOpen} />
      <DynamicDiv marginTop={height}>
        <GardensList />
      </DynamicDiv>
      <Onboarding onClose={handleOnboardingClose} visible={onboardingVisible} />
    </div>
  )
}

const DynamicDiv = styled.div.attrs(props => ({
  style: { marginTop: props.marginTop + 'px' },
}))``

export default Home
