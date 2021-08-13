import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import GardensList from './GardensList'
import Onboarding from './Onboarding'
import LandingBanner from './LandingBanner'
import { useWallet } from '@providers/Wallet'
import { useNodeHeight } from '@hooks/useNodeHeight'
import MultiModal from './MultiModal/MultiModal'
import ConnectWalletScreens from './ModalFlows/ConnectWallet/ConnectWalletScreens'

function Home() {
  const [height, ref] = useNodeHeight()
  const [onboardingVisible, setOnboardingVisible] = useState(false)
  const [connectModalVisible, setConnectModalVisible] = useState(false)

  const { account } = useWallet()

  const handleOnboardingOpen = useCallback(() => {
    if (!account) {
      setConnectModalVisible(true)
      return
    }
    setOnboardingVisible(true)
  }, [account])

  const handleOnboardingClose = useCallback(() => {
    setOnboardingVisible(false)
  }, [])

  const handleCloseModal = useCallback(() => {
    setConnectModalVisible(false)
  }, [])

  return (
    <div>
      <LandingBanner ref={ref} onCreateGarden={handleOnboardingOpen} />
      <DynamicDiv marginTop={height}>
        <GardensList />
      </DynamicDiv>
      <Onboarding onClose={handleOnboardingClose} visible={onboardingVisible} />
      <MultiModal visible={connectModalVisible} onClose={handleCloseModal}>
        <ConnectWalletScreens onSuccess={handleCloseModal} />
      </MultiModal>
    </div>
  )
}

const DynamicDiv = styled.div.attrs(props => ({
  style: { marginTop: props.marginTop + 'px' },
}))``

export default Home
