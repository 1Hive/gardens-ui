import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppState } from '../providers/AppState'

const PROPOSAL_ID_PATH_RE = /^\/proposal\/([0-9]+)\/?$/
const NO_PROPOSAL_ID = '-1'

function idFromPath(path) {
  if (!path) {
    return NO_PROPOSAL_ID
  }
  const matches = path.match(PROPOSAL_ID_PATH_RE)
  return matches ? matches[1] : NO_PROPOSAL_ID
}

// Get the proposal currently selected, or null otherwise.
export default function useSelectedProposal(proposals) {
  const { isLoading } = useAppState()
  const location = useLocation()

  // The memoized proposal currently selected.
  const selectedProposal = useMemo(() => {
    const id = idFromPath(location.pathname)

    // The `isLoading` check prevents a proposal to be
    // selected until the app state is fully ready.
    if (isLoading || id === NO_PROPOSAL_ID) {
      return null
    }

    return (
      proposals.find(proposal => Number(proposal.id) === Number(id)) || null
    )
  }, [isLoading, location.pathname, proposals])

  return selectedProposal
}
