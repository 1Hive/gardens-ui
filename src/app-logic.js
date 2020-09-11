import useActions from './hooks/useActions'
import { useAppState } from './providers/AppState'
import { useMyStakes } from './hooks/useStakes'
import usePanelState from './hooks/usePanelState'
import { useProposals } from './hooks/useProposals'

// Handles the main logic of the app.
export default function useAppLogic() {
  const { isLoading, totalStaked } = useAppState()

  const [proposals, blockHasLoaded] = useProposals()
  const proposalPanel = usePanelState()
  const myStakes = useMyStakes()

  const actions = useActions(proposalPanel.requestClose)

  return {
    actions,
    isLoading: isLoading || !blockHasLoaded,
    myStakes,
    proposals,
    proposalPanel,
    totalStaked,
  }
}
