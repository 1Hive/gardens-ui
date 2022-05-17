import { useRouter } from 'next/router'

import useActions from '@hooks/useActions'
import { useProposal } from '@hooks/useProposals'
import { useGardenState } from '@providers/GardenState'

export type ProposalLogicProps = {
  params: {
    id: string
  }
  path: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function useProposalLogic(_match?: ProposalLogicProps) {
  const router = useRouter()
  const query = router.query
  const { id: proposalId } = query

  const {
    commonPool,
    config,
    loading: gardenLoading,
    permissions,
  } = useGardenState()
  const { requestToken, stableToken } = config?.conviction || {}

  // Get appAddress depending of current router path
  const appAddress = router.asPath.includes('vote')
    ? config?.voting.id.slice(0, 42)
    : config?.conviction.id

  const actions = useActions()
  const [proposal, blockHasLoaded, loadingProposal] = useProposal(
    proposalId,
    appAddress
  )

  return {
    actions,
    commonPool,
    loading: gardenLoading || !blockHasLoaded || loadingProposal,
    permissions,
    proposal,
    requestToken,
    stableToken,
  }
}
