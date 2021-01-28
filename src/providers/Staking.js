import React, { useContext, useMemo } from 'react'
import { useStaking } from '../hooks/useStaking'

const StakingContext = React.createContext({
  staking: {},
  loading: true,
})

function StakingProvider({ children }) {
  const [stakeManagement, stakeActions, loading] = useStaking()

  const Staking = useMemo(
    () => ({
      stakeManagement,
      stakeActions,
      loading,
    }),
    [stakeManagement, stakeActions, loading]
  )

  return (
    <StakingContext.Provider value={Staking}>
      {children}
    </StakingContext.Provider>
  )
}

function useStakingState() {
  return useContext(StakingContext)
}

export { StakingProvider, useStakingState }
