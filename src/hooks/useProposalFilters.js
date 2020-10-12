import { useCallback, useEffect, useMemo, useState } from 'react'
import { useWallet } from '../providers/Wallet'
import {
  filterArgsMapping,
  NULL_FILTER_STATE,
  RANKING_FILTER_TOP,
  RANKING_ITEMS,
  STATUS_FILTER_OPEN,
  STATUS_ITEMS,
  SUPPORT_ITEMS,
  TYPE_ITEMS,
} from '../utils/filter-utils'

const INITIAL_PROPOSAL_COUNT = 10
const PROPOSAL_COUNT_STEP = 5

// Status and Type filters will be used as subgraph query args.
// Support will be filtered locally as there is not an easy way to achieve this only by querying the subgraph.
export default function useProposalFilters() {
  const { account } = useWallet()
  const [proposalCount, setProposalCount] = useState(INITIAL_PROPOSAL_COUNT)
  const [rankingFilter, setRankingFilter] = useState(RANKING_FILTER_TOP)
  const [statusFilter, setStatusFilter] = useState(STATUS_FILTER_OPEN)
  const [supportFilter, setSupportFilter] = useState(NULL_FILTER_STATE)
  const [typeFilter, setTypeFilter] = useState(NULL_FILTER_STATE)

  const handlePoposalCountIncrease = useCallback(index => {
    setProposalCount(count => count + PROPOSAL_COUNT_STEP)
  }, [])
  const handleRankingFilterChange = useCallback(index => {
    setRankingFilter(index)
  }, [])
  const handleStatusFilterChange = useCallback(
    index => setStatusFilter(index || NULL_FILTER_STATE),
    []
  )
  const handleSupportFilterChange = useCallback(
    index => setSupportFilter(index || NULL_FILTER_STATE),
    []
  )
  const handleTypeFilterChange = useCallback(
    index => setTypeFilter(index || NULL_FILTER_STATE),
    []
  )

  const handleClearFilters = useCallback(() => {
    setStatusFilter(STATUS_FILTER_OPEN)
    setSupportFilter(NULL_FILTER_STATE)
    setTypeFilter(NULL_FILTER_STATE)
  }, [])

  useEffect(() => {
    if (!account) {
      setSupportFilter(NULL_FILTER_STATE)
    }
  }, [account])

  const isActive =
    statusFilter > STATUS_FILTER_OPEN ||
    supportFilter > NULL_FILTER_STATE ||
    typeFilter > NULL_FILTER_STATE

  return useMemo(
    () => ({
      isActive,
      onClear: handleClearFilters,
      onProposalCountIncrease: handlePoposalCountIncrease,
      proposalCount,
      ranking: {
        items: RANKING_ITEMS,
        filter: rankingFilter,
        onChange: handleRankingFilterChange,
        queryArgs: getQueryArgsByFilter('ranking', rankingFilter),
      },
      status: {
        items: STATUS_ITEMS,
        filter: statusFilter,
        onChange: handleStatusFilterChange,
        queryArgs: getQueryArgsByFilter('status', statusFilter),
      },
      support: {
        items: SUPPORT_ITEMS,
        filter: supportFilter,
        onChange: handleSupportFilterChange,
      },
      type: {
        items: TYPE_ITEMS,
        filter: typeFilter,
        onChange: handleTypeFilterChange,
        queryArgs: getQueryArgsByFilter('type', typeFilter),
      },
    }),
    [
      isActive,
      handleClearFilters,
      handlePoposalCountIncrease,
      handleRankingFilterChange,
      handleStatusFilterChange,
      handleSupportFilterChange,
      handleTypeFilterChange,
      proposalCount,
      rankingFilter,
      statusFilter,
      supportFilter,
      typeFilter,
    ]
  )
}

function getQueryArgsByFilter(key, filter) {
  if (key !== 'ranking' && filter === NULL_FILTER_STATE) {
    return null
  }

  const { queryKey } = filterArgsMapping[key]
  return { [queryKey]: filterArgsMapping[key][filter] }
}
