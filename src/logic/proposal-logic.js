import useActions from '@hooks/useActions'
import { useGardenState } from '@providers/GardenState'
import { useProposal } from '@hooks/useProposals'

export default function useProposalLogic(match) {
  const { params, path } = match
  const { id: proposalId } = params

  const {
    config,
    loading: gardenLoading,
    permissions,
    vaultBalance,
  } = useGardenState()
  const { requestToken, stableToken } = config?.conviction || {}

  // Get appAddress depending of current router path
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
    loading: gardenLoading || !blockHasLoaded || loadingProposal,
    permissions,
    proposal,
    requestToken,
    stableToken,
    vaultBalance,
  }
}
