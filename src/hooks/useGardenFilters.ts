import {
  filterArgsMapping,
  FILTER_KEY_NAME,
  FILTER_KEY_SORTING,
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
  const [sortingFilter, setSortingFilter] = useState<any>(
    filtersCache.get(FILTER_KEY_SORTING) || SORTING_FILTER_LIQUIDITY
  )

  const handleNameFilterChange = useCallback(newName => {
    setNameFilter(newName)
    filtersCache.set(FILTER_KEY_NAME, newName)
  }, [])

  const handleSortingFilterChange = useCallback(index => {
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

function getQueryArgsByFilter(key: string, filter: string) {
  const { queryKey } = filterArgsMapping[key]
  return { [queryKey]: filterArgsMapping[key][filter] }
}
