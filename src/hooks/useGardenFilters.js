import { useCallback, useMemo, useState } from 'react'

import {
  FILTER_KEY_NAME,
  FILTER_KEY_SORTING,
  SORTING_FILTER_LIQUIDITY,
  SORTING_ITEMS,
  filterArgsMapping,
} from '@/utils/garden-filters-utils'

const filtersCache = new Map([])

export default function useGardenFilters() {
  // Local filters
  const [nameFilter, setNameFilter] = useState(
    filtersCache.get(FILTER_KEY_NAME) || ''
  )
  // Subgraph query filters
  const [sortingFilter, setSortingFilter] = useState(
    filtersCache.get(FILTER_KEY_SORTING) || SORTING_FILTER_LIQUIDITY
  )

  const handleNameFilterChange = useCallback((newName) => {
    setNameFilter(newName)
    filtersCache.set(FILTER_KEY_NAME, newName)
  }, [])

  const handleSortingFilterChange = useCallback((index) => {
    setSortingFilter(index)
    filtersCache.set(FILTER_KEY_SORTING, index)
  }, [])

  const queryFilters = useMemo(
    () => ({
      sorting: {
        items: SORTING_ITEMS,
        filter: sortingFilter,
        onChange: handleSortingFilterChange,
        queryArgs: getQueryArgsByFilter('sorting', sortingFilter),
      },
    }),
    [sortingFilter, handleSortingFilterChange]
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
