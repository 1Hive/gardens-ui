import React, { useContext, useMemo } from 'react'
import { useStaking } from '@hooks/useStaking'

type State = {
  stakeManagement: any
  stakeActions: any
  loading: any
}

const StakingContext = React.createContext<State>({
  stakeManagement: null,
  stakeActions: null,
  loading: false,
})

function StakingProvider({ children }: { children: React.ReactNode }) {
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

function useStakingState(): React.ContextType<typeof StakingContext> {
  return useContext(StakingContext)
}

export { StakingProvider, useStakingState }
