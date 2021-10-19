import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { GU, useToast } from '@1hive/1hive-ui'
import { useGardens } from '@/providers/Gardens'
import { useNodeHeight } from '@hooks/useNodeHeight'

import GardensFilters from './GardensFilters'
import GardensList from './GardensList'
import LandingBanner from './LandingBanner'
import Loader from './Loader'
import Onboarding from './Onboarding'

function Home() {
  const [height, ref] = useNodeHeight()
  const { externalFilters, internalFilters, gardens, loading } = useGardens()
  const [onboardingVisible, setOnboardingVisible] = useState(false)
  const toast = useToast()

  const handleOnboardingOpen = useCallback(() => {
    setOnboardingVisible(true)
  }, [])

  const handleOnboardingClose = useCallback(() => {
    setOnboardingVisible(false)
    toast('Saved!')
  }, [toast])

  return (
    <div>
      <LandingBanner ref={ref} onCreateGarden={handleOnboardingOpen} />
      <DynamicDiv
        marginTop={height + 3 * GU}
        css={`
          padding: 0 ${2 * GU}px;
        `}
      >
        <GardensFilters
          itemsSorting={externalFilters.sorting.items}
          nameFilter={internalFilters.name.filter}
          sortingFilter={externalFilters.sorting.filter}
          onNameFilterChange={internalFilters.name.onChange}
          onSortingFilterChange={externalFilters.sorting.onChange}
        />
        <div
          css={`
            margin: ${5 * GU}px 0;
          `}
        >
          {!loading ? <GardensList gardens={gardens} /> : <Loader />}
        </div>
      </DynamicDiv>
      <Onboarding onClose={handleOnboardingClose} visible={onboardingVisible} />
    </div>
  )
}

const DynamicDiv = styled.div.attrs(props => ({
  style: { marginTop: props.marginTop + 'px' },
}))``

export default Home
