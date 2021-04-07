import useActions from '../hooks/useActions'
import { useAppState } from '../providers/AppState'
import usePanelState from '../hooks/usePanelState'
import { useProposals } from '../hooks/useProposals'

// Handles the main logic of the app.
export default function useAppLogic() {
  const {
    errors,
    isLoading,
    totalStaked,
    totalSupply,
    vaultBalance,
  } = useAppState()

  const proposalPanel = usePanelState()
  const actions = useActions(proposalPanel.requestClose)
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
    proposalPanel,
    totalStaked,
    totalSupply,
  }
}
