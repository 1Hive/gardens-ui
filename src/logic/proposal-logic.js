import useActions from '../hooks/useActions'
import { useAppState } from '../providers/AppState'
import usePanelState from '../hooks/usePanelState'
import { useProposal } from '../hooks/useProposals'

export default function useProposalLogic(match) {
  const { params, path } = match
  const { id: proposalId } = params

  const {
    config,
    isLoading,
    permissions,
    requestToken,
    vaultBalance,
  } = useAppState()
  const appAddress = path.includes('vote')
    ? config?.voting.id
    : config?.conviction.id

  const panelState = usePanelState()
  const actions = useActions(panelState.requestClose)
  const [proposal, blockHasLoaded, loadingProposal] = useProposal(
    proposalId,
    appAddress
  )

  return {
    actions,
    isLoading: isLoading || !blockHasLoaded || loadingProposal,
    panelState,
    permissions,
    proposal,
    requestToken,
    vaultBalance,
  }
}
