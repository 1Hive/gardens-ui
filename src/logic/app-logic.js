import useActions from '../hooks/useActions'
import { useGardenState } from '../providers/GardenState'
import { useProposals } from '../hooks/useProposals'

// Handles the main logic of the app.
export default function useAppLogic() {
  const {
    errors,
    isLoading,
    totalStaked,
    totalSupply,
    vaultBalance,
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
    errors,
    filters,
    isLoading: isLoading || !blockHasLoaded,
    proposals,
    proposalsFetchedCount,
    totalStaked,
    totalSupply,
  }
}
