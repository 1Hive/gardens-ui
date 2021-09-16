import { getNetwork } from '@/networks'
import {
  filterArgsMapping,
  FILTER_KEY_NAME,
  FILTER_KEY_NETWORK,
  FILTER_KEY_SORTING,
  NETWORK_FILTER_RINKEBY,
  NETWORK_FILTER_XDAI,
  NETWORK_ITEMS,
  SORTING_FILTER_LIQUIDITY,
  SORTING_ITEMS,
} from '@/utils/garden-filters-utils'
import { useCallback, useMemo, useState } from 'react'

const filtersCache = new Map([])

export default function useGardenFilters() {
  // Local filters
  const [nameFilter, setNameFilter] = useState(
    filtersCache.get(FILTER_KEY_NAME) || ''
  )
  // Subgraph query filters
  const [networkFilter, setNetworkFilter] = useState(
    filtersCache.get(FILTER_KEY_NETWORK) || getNetwork().chainId === 100
      ? NETWORK_FILTER_XDAI
      : NETWORK_FILTER_RINKEBY
  )
  const [sortingFilter, setSortingFilter] = useState(
    filtersCache.get(FILTER_KEY_SORTING) || SORTING_FILTER_LIQUIDITY
  )

  const handleNameFilterChange = useCallback(newName => {
    setNameFilter(newName)
    filtersCache.set(FILTER_KEY_NAME, newName)
  }, [])

  const handleNetworkFilterChange = useCallback(newNetwork => {
    setNetworkFilter(newNetwork)
    filtersCache.set(FILTER_KEY_NETWORK, newNetwork)
  }, [])

  const handleSortingFilterChange = useCallback(index => {
    setSortingFilter(index)
    filtersCache.set(FILTER_KEY_SORTING, index)
  }, [])

  const queryFilters = useMemo(
    () => ({
      network: {
        items: NETWORK_ITEMS,
        filter: networkFilter,
        onChange: handleNetworkFilterChange,
        queryArgs: getQueryArgsByFilter('network', networkFilter),
      },
      sorting: {
        items: SORTING_ITEMS,
        filter: sortingFilter,
        onChange: handleSortingFilterChange,
        queryArgs: getQueryArgsByFilter('sorting', sortingFilter),
      },
    }),
    [
      networkFilter,
      sortingFilter,
      handleNetworkFilterChange,
      handleSortingFilterChange,
    ]
  )
  const filters = {
    name: {
      filter: nameFilter,
      onChange: handleNameFilterChange,
    },
  }

  return [queryFilters, filters]
}

function getQueryArgsByFilter(key, filter) {
  const { queryKey } = filterArgsMapping[key]
  return { [queryKey]: filterArgsMapping[key][filter] }
}
