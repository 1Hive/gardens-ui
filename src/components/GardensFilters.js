import React, { useCallback } from 'react'

import styled from 'styled-components'

import { DropDown, GU, SearchInput, useLayout } from '@1hive/1hive-ui'

import { getNetworkName } from '@utils/web3-utils'

import { useWallet } from '@providers/Wallet'

import { SUPPORTED_CHAINS } from '@/networks'

const GardensFilters = ({
  itemsSorting,
  nameFilter,
  sortingFilter,
  onNameFilterChange,
  onSortingFilterChange,
}) => {
  const { layoutName } = useLayout()
  const { onPreferredNetworkChange, preferredNetwork } = useWallet()

  const supportedChains = SUPPORTED_CHAINS.map((chain) => getNetworkName(chain))
  const selectedIndex = SUPPORTED_CHAINS.indexOf(preferredNetwork)

  const handleNetworkChange = useCallback(
    (index) => {
      const chainId = SUPPORTED_CHAINS[index]
      onPreferredNetworkChange(chainId)
    },
    [onPreferredNetworkChange]
  )

  return (
    <div
      css={`
        display: flex;
        width: ${layoutName === 'small' ? 100 : 50}%;
        gap: ${1 * GU}px;
        flex-wrap: wrap;
      `}
    >
      <FilterItem>
        <DropDown
          items={supportedChains}
          onChange={handleNetworkChange}
          selected={selectedIndex}
          wide
        />
      </FilterItem>
      <FilterItem>
        <DropDown
          header="Sort by"
          items={itemsSorting}
          onChange={onSortingFilterChange}
          selected={sortingFilter}
          wide
        />
      </FilterItem>
      {layoutName === 'small' && <Break />}
      <FilterItem grow={1.3}>
        <SearchInput
          value={nameFilter}
          onChange={onNameFilterChange}
          placeholder="Search by Garden name"
          wide
        />
      </FilterItem>
    </div>
  )
}

const FilterItem = styled.div`
  flex: ${({ grow }) => grow ?? 1};
`

const Break = styled.div`
  flex-basis: 100%;
  height: 0;
`

export default GardensFilters
