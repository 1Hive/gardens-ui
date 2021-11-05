export const SORTING_FILTER_LIQUIDITY = 0
export const SORTING_FILTER_MEMBERS = 1
export const SORTING_FILTER_PROPOSALS_COUNTER = 2

export const FILTER_KEY_NAME = 'name'
export const FILTER_KEY_SORTING = 'sorting'

export const SORTING_ITEMS = ['Liquidity', 'Members', 'Proposals']

export const filterArgsMapping = {
  [FILTER_KEY_NAME]: {
    queryKey: '',
  },
  [FILTER_KEY_SORTING]: {
    queryKey: 'orderBy',
    [SORTING_FILTER_LIQUIDITY]: 'honeyLiquidity',
    [SORTING_FILTER_MEMBERS]: 'supporterCount',
    [SORTING_FILTER_PROPOSALS_COUNTER]: 'proposalCount',
  },
}

export const testNameFilter = (filterName, garden) => {
  return (
    garden.name && garden.name.toLowerCase().includes(filterName.toLowerCase())
  )
}
