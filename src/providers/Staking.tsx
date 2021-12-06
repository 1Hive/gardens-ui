import React, { useContext, useMemo } from 'react';
import { useStaking } from '@hooks/useStaking';

type State = {
  staking?: null;
  loading: boolean;
  stakeManagement?: any;
  stakeActions?: any;
};

const StakingContext = React.createContext<State | undefined | null>({
  staking: null,
  loading: true,
});

function StakingProvider({ children }) {
  const [stakeManagement, stakeActions, loading] = useStaking();

  const Staking = useMemo(
    () => ({
      stakeManagement,
      stakeActions,
      loading,
    }),
    [stakeManagement, stakeActions, loading],
  );

  return <StakingContext.Provider value={Staking}>{children}</StakingContext.Provider>;
}

function useStakingState() {
  return useContext(StakingContext);
}

export { StakingProvider, useStakingState };
