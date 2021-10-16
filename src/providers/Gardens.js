import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useRouteMatch } from 'react-router-dom'
import { addressesEqual } from '@1hive/1hive-ui'
import { getGardens } from '@1hive/connect-gardens'

import { AgreementSubscriptionProvider } from './AgreementSubscription'
import { ConnectProvider as Connect } from './Connect'
import { GardenStateProvider } from './GardenState'
import { StakingProvider } from './Staking'

import { fetchFileContent } from '../services/github'

import { DAONotFound } from '../errors'
import { getNetwork } from '../networks'
import { getGardenForumUrl } from '../utils/garden-utils'
import useGardenFilters from '@/hooks/useGardenFilters'
import { testNameFilter } from '@/utils/garden-filters-utils'
import { useDebounce } from '@/hooks/useDebounce'

import { getVoidedGardensByNetwork } from '../voided-gardens'

const DAOContext = React.createContext()

export function GardensProvider({ children }) {
  const [queryFilters, filters] = useGardenFilters()
  const [gardens, loading, reload] = useGardensList(queryFilters, filters)

  const match = useRouteMatch('/garden/:daoId')

  const connectedGarden = useMemo(() => {
    if (match) {
      const gardenAddress = match.params.daoId
      return gardens.find(d => addressesEqual(gardenAddress, d.address))
    }

    return null
  }, [gardens, match])

  if (match && !connectedGarden && !loading) {
    throw new DAONotFound(match.params.daoId)
  }

  return (
    <DAOContext.Provider
      value={{
        connectedGarden,
        internalFilters: filters,
        externalFilters: queryFilters,
        gardens,
        loading,
        reload,
      }}
    >
      {connectedGarden ? (
        <Connect>
          <GardenStateProvider>
            <StakingProvider>
              <AgreementSubscriptionProvider>
                {children}
              </AgreementSubscriptionProvider>
            </StakingProvider>
          </GardenStateProvider>
        </Connect>
      ) : (
        children
      )}
    </DAOContext.Provider>
  )
}

export function useGardens() {
  return useContext(DAOContext)
}

function useFilteredGardens(gardens, filters) {
  const debouncedNameFilter = useDebounce(filters.name.filter, 300)

  return useMemo(() => {
    if (!debouncedNameFilter) {
      return gardens
    }
    return gardens.filter(garden => testNameFilter(debouncedNameFilter, garden))
  }, [debouncedNameFilter, gardens])
}

function useGardensList(queryFilters, filters) {
  const [gardens, setGardens] = useState([])
  const filteredGardens = useFilteredGardens(gardens, filters)
  const [loading, setLoading] = useState(true)
  const [gardensMetadata, setGardensMetadata] = useState([])
  const [loadingMetadata, setLoadingMetadata] = useState(true)
  const { sorting } = queryFilters
  const [refetchTriger, setRefetchTriger] = useState(false)

  const reload = useCallback(() => {
    setRefetchTriger(triger => setRefetchTriger(!triger))
  }, [])

  useEffect(() => {
    setLoading(true)
    const fetchGardens = async () => {
      try {
        setLoading(true)

        const result = await getGardens(
          { network: getNetwork().chainId },
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
  }, [sorting.queryArgs])

  useEffect(() => {
    setLoadingMetadata(true)
    const fetchGardenMetadata = async () => {
      try {
        const result = await fetchFileContent(getNetwork().chainId)
        setGardensMetadata(result.data)
      } catch (err) {
        setGardensMetadata([])
        console.error(`Error fetching gardens metadata ${err}`)
      }
      setLoadingMetadata(false)
    }

    fetchGardenMetadata()
  }, [refetchTriger])

  return [
    useMemo(
      () =>
        filteredGardens.map(garden =>
          mergeGardenMetadata(garden, gardensMetadata)
        ),
      [filteredGardens, gardensMetadata]
    ),
    loading || loadingMetadata,
    reload,
  ]
}

function mergeGardenMetadata(garden, gardensMetadata) {
  const metadata =
    gardensMetadata.gardens?.find(dao =>
      addressesEqual(dao.address, garden.id)
    ) || {}

  const token = {
    ...garden.token,
    logo: metadata.token_logo,
  }
  const wrappableToken = garden.wrappableToken
    ? {
        ...garden.wrappableToken,
        ...metadata.wrappableToken,
      }
    : null

  const forumURL = getGardenForumUrl(metadata)

  return {
    ...garden,
    ...metadata,
    address: garden.id,
    forumURL,
    token,
    wrappableToken,
  }
}
