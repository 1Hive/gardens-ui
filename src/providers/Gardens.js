import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { getGardens } from '@1hive/connect-gardens'

import { ConnectedGardenProvider } from './ConnectedGarden'
import { useDebounce } from '@hooks/useDebounce'
import useGardenFilters from '@hooks/useGardenFilters'
import { useWallet } from './Wallet'

import { fetchFileContent } from '../services/github'
import { getVoidedGardensByNetwork } from '../voided-gardens'
import { mergeGardenMetadata } from '@utils/garden-utils'
import { testNameFilter } from '@utils/garden-filters-utils'

const DAOContext = React.createContext()

export function GardensProvider({ children }) {
  const { preferredNetwork } = useWallet()
  const [queryFilters, filters] = useGardenFilters()
  const [gardens, gardensMetadata, gardensLoading, reload] = useGardensList(
    queryFilters,
    filters,
    preferredNetwork
  )

  return (
    <DAOContext.Provider
      value={{
        internalFilters: filters,
        externalFilters: queryFilters,
        gardens,
        gardensMetadata,
        loading: gardensLoading,
        reload,
      }}
    >
      <ConnectedGardenProvider>{children}</ConnectedGardenProvider>
    </DAOContext.Provider>
  )
}

export function useGardens() {
  return useContext(DAOContext)
}

function useFilteredGardens(gardens, gardensMetadata, filters) {
  const debouncedNameFilter = useDebounce(filters.name.filter, 300)

  return useMemo(() => {
    const mergedGardens = gardens.map(garden =>
      mergeGardenMetadata(garden, gardensMetadata)
    )
    if (!debouncedNameFilter) {
      return mergedGardens
    }
    return mergedGardens.filter(garden =>
      testNameFilter(debouncedNameFilter, garden)
    )
  }, [debouncedNameFilter, gardens, gardensMetadata])
}

function useGardensMetadata(refetchTriger, chainId) {
  const [gardensMetadata, setGardensMetadata] = useState([])
  const [loadingMetadata, setLoadingMetadata] = useState(true)

  useEffect(() => {
    setLoadingMetadata(true)
    const fetchGardenMetadata = async () => {
      try {
        const result = await fetchFileContent(chainId)
        setGardensMetadata(result.data.gardens)
      } catch (err) {
        setGardensMetadata([])
        console.error(`Error fetching gardens metadata ${err}`)
      }
      setLoadingMetadata(false)
    }

    fetchGardenMetadata()
  }, [chainId, refetchTriger])

  return [gardensMetadata, loadingMetadata]
}

function useGardensList(queryFilters, filters, chainId) {
  const [gardens, setGardens] = useState([])
  const [loading, setLoading] = useState(true)
  const [refetchTriger, setRefetchTriger] = useState(false)

  const { sorting } = queryFilters

  const [gardensMetadata, loadingMetadata] = useGardensMetadata(
    refetchTriger,
    chainId
  )
  const filteredGardens = useFilteredGardens(gardens, gardensMetadata, filters)

  const reload = useCallback(() => {
    setRefetchTriger(triger => setRefetchTriger(!triger))
  }, [])

  useEffect(() => {
    setLoading(true)
    const fetchGardens = async () => {
      try {
        const result = await getGardens(
          { network: chainId },
          { ...sorting.queryArgs }
        )

        setGardens(
          result.filter(garden => !getVoidedGardensByNetwork().get(garden.id))
        )
      } catch (err) {
        setGardens([])
        console.error(`Error fetching gardens ${err}`)
      }
      setLoading(false)
    }

    fetchGardens()
  }, [chainId, refetchTriger, sorting.queryArgs])

  return [filteredGardens, gardensMetadata, loading || loadingMetadata, reload]
}
