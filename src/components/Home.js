import React, { useCallback, useState } from 'react'
// import { useViewport } from '@1hive/1hive-ui'
import styled from 'styled-components'
import GardensList from './GardensList'
import Onboarding from './Onboarding'
import LandingBanner from './LandingBanner'
// import UnsupportedChainAnimation from './UnsupportedChainAnimation'
import { useWallet } from '@providers/Wallet'
import { useNodeHeight } from '@hooks/useNodeHeight'
import MultiModal from './MultiModal/MultiModal'
import ConnectWalletScreens from './ModalFlows/ConnectWallet/ConnectWalletScreens'
// import { getPreferredChain } from '@/local-settings'

// import { isSupportedChain } from '@/networks'

function Home() {
  const [height, ref] = useNodeHeight()
  // const { width } = useViewport()
  const [onboardingVisible, setOnboardingVisible] = useState(false)
  const [connectModalVisible, setConnectModalVisible] = useState(false)

  const { account } = useWallet()

  // const preferredChain = getPreferredChain()

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
    console.log('close!!!!!')
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

/* <Modal
        padding={7 * GU}
        visible={!preferredChain && !account}
        width={Math.min(55 * GU, width - 40)}
      >
        <div
          css={`
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          `}
        >
          <div
            css={`
              display: flex;
              border-radius: 50%;
              background: #f9f9f9;
              width: ${7 * GU}px;
              height: ${7 * GU}px;
              align-items: center;
              justify-content: center;
            `}
          >
            <IconConnect
              css={`
                color: #d7d7d7;
              `}
              size="large"
            />
          </div>
          <h3
            css={`
              ${textStyle('title2')}
              margin-top: 24px;
              margin-bottom: 8px;
            `}
          >
            Login and Authorize Your Wallet
          </h3>
          <h4
            css={`
              ${textStyle('body3')}
            `}
          >
            This dapp requires access to your wallet, please login and authorize
            access to your wallet accounts to continue.
          </h4>
          <Button
            onClick={() => {}}
            wide
            css={`
              margin-top: ${3 * GU}px;
            `}
          >
            Dismiss
          </Button>
        </div>
      </Modal> */
