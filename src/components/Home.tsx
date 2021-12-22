import React, { useCallback, useState } from 'react'

import styled from 'styled-components'

import { GU, useToast } from '@1hive/1hive-ui'

import { useNodeHeight } from '@hooks/useNodeHeight'

import { useGardens } from '@providers/Gardens'
import { useWallet } from '@providers/Wallet'

import GardensFilters from './GardensFilters'
import GardensList from './GardensList'
import LandingBanner from './LandingBanner'
import Loader from './Loader'
import ConnectWalletScreens from './MultiModal/ConnectWallet/ConnectWalletScreens'
import MultiModal from './MultiModal/MultiModal'
import Onboarding from './Onboarding'

const DynamicSection = styled.div<{
  marginTop: any
}>`
  margin-top: ${(props) => props.marginTop}px;
  padding: 0 ${2 * GU}px;
`

const LoadingSection = styled.div`
  margin: ${5 * GU}px 0;
`

function Home() {
  const { height, customRef } = useNodeHeight()
  const { externalFilters, internalFilters, gardens, loading } = useGardens()
  const [onboardingVisible, setOnboardingVisible] = useState(false)
  const [connectModalVisible, setConnectModalVisible] = useState(false)

  const { account } = useWallet()
  const toast = useToast()

  const handleOnboardingOpen = useCallback(() => {
    if (!account) {
      setConnectModalVisible(true)
      return
    }
    setOnboardingVisible(true)
  }, [account])

  const handleOnboardingClose = useCallback(() => {
    setOnboardingVisible(false)
    toast('Saved!')
  }, [toast])

  const handleCloseModal = useCallback(() => {
    setConnectModalVisible(false)
  }, [])

  return (
    <div>
      <LandingBanner ref={customRef} onCreateGarden={handleOnboardingOpen} />
      <DynamicSection marginTop={height + 3 * GU}>
        <GardensFilters
          itemsSorting={externalFilters.sorting.items}
          nameFilter={internalFilters.name.filter}
          sortingFilter={externalFilters.sorting.filter}
          onNameFilterChange={internalFilters.name.onChange}
          onSortingFilterChange={externalFilters.sorting.onChange}
        />
        <LoadingSection>
          {!loading ? <GardensList gardens={gardens} /> : <Loader />}
        </LoadingSection>
      </DynamicSection>
      <Onboarding onClose={handleOnboardingClose} visible={onboardingVisible} />
      <MultiModal visible={connectModalVisible} onClose={handleCloseModal}>
        <ConnectWalletScreens
          onClose={handleCloseModal}
          onSuccess={handleOnboardingOpen}
        />
      </MultiModal>
    </div>
  )
}

export default Home
