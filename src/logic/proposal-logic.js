import useActions from '@hooks/useActions'
import { useGardenState } from '@providers/GardenState'
import { useProposal } from '@hooks/useProposals'

export default function useProposalLogic(match) {
  const { params, path } = match
  const { id: proposalId } = params

  const {
    config,
    isLoading,
    permissions,
    requestToken,
    stableToken,
    vaultBalance,
  } = useGardenState()
  const appAddress = path.includes('vote')
    ? config?.voting.id.slice(0, 42)
    : config?.conviction.id

  const actions = useActions()
  const [proposal, blockHasLoaded, loadingProposal] = useProposal(
    proposalId,
    appAddress
  )

  return {
    actions,
    isLoading: isLoading || !blockHasLoaded || loadingProposal,
    permissions,
    proposal,
    requestToken,
    stableToken,
    vaultBalance,
  }
}
