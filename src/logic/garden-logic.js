import useActions from '@hooks/useActions'
import { useGardenState } from '@providers/GardenState'
import { useProposals } from '@hooks/useProposals'

// Handles the main logic of the app.
export default function useAppLogic() {
  const {
    config,
    errors,
    loading,
    token,
    totalSupply,
    vaultBalance,
    wrappableToken,
  } = useGardenState()

  const actions = useActions()
  const [
    proposals,
    filters,
    proposalsFetchedCount,
    blockHasLoaded,
  ] = useProposals()

  return {
    actions,
    commonPool: vaultBalance,
    config,
    errors,
    filters,
    loading: loading || !blockHasLoaded,
    metricsToken: (wrappableToken || token).data,
    proposals,
    proposalsFetchedCount,
    totalSupply,
  }
}
