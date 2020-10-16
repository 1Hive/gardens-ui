import { useCallback, useEffect, useMemo, useState } from 'react'
import { useWallet } from '../providers/Wallet'
import {
  filterArgsMapping,
  FILTER_KEY_COUNT,
  FILTER_KEY_RANKING,
  FILTER_KEY_STATUS,
  FILTER_KEY_SUPPORT,
  FILTER_KEY_TYPE,
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

const filtersCache = new Map([])

// Status and Type filters will be used as subgraph query args.
// Support will be filtered locally as there is not an easy way to achieve this only by querying the subgraph.
export default function useProposalFilters() {
  const { account } = useWallet()
  const [proposalCount, setProposalCount] = useState(
    filtersCache.get(FILTER_KEY_COUNT) || INITIAL_PROPOSAL_COUNT
  )
  const [rankingFilter, setRankingFilter] = useState(
    filtersCache.get(FILTER_KEY_RANKING) || RANKING_FILTER_TOP
  )
  const [statusFilter, setStatusFilter] = useState(
    filtersCache.get(FILTER_KEY_STATUS) || STATUS_FILTER_OPEN
  )
  const [supportFilter, setSupportFilter] = useState(
    filtersCache.get(FILTER_KEY_SUPPORT) || NULL_FILTER_STATE
  )
  const [typeFilter, setTypeFilter] = useState(
    filtersCache.get(FILTER_KEY_TYPE) || NULL_FILTER_STATE
  )

  const handlePoposalCountIncrease = useCallback(
    index => {
      const newCount = proposalCount + PROPOSAL_COUNT_STEP
      setProposalCount(newCount)
      filtersCache.set(FILTER_KEY_COUNT, newCount)
    },
    [proposalCount]
  )
  const handleRankingFilterChange = useCallback(index => {
    setRankingFilter(index)
    filtersCache.set(FILTER_KEY_RANKING, index)
  }, [])
  const handleStatusFilterChange = useCallback(index => {
    const newStatus = index || NULL_FILTER_STATE
    setStatusFilter(newStatus)
    filtersCache.set(FILTER_KEY_STATUS, newStatus)
  }, [])
  const handleSupportFilterChange = useCallback(index => {
    const newSupport = index || NULL_FILTER_STATE
    setSupportFilter(newSupport)
    filtersCache.set(FILTER_KEY_SUPPORT, newSupport)
  }, [])
  const handleTypeFilterChange = useCallback(index => {
    const newType = index || NULL_FILTER_STATE
    setTypeFilter(newType)
    filtersCache.set(FILTER_KEY_TYPE, newType)
  }, [])

  const handleClearFilters = useCallback(() => {
    setStatusFilter(STATUS_FILTER_OPEN)
    setSupportFilter(NULL_FILTER_STATE)
    setTypeFilter(NULL_FILTER_STATE)

    filtersCache.clear()
  }, [])

  useEffect(() => {
    if (!account) {
      setSupportFilter(NULL_FILTER_STATE)
      filtersCache.set(FILTER_KEY_SUPPORT, NULL_FILTER_STATE)
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
