import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useRouteMatch } from 'react-router-dom'
import { addressesEqual } from '@1hive/1hive-ui'
import { getGardens, getGarden } from '@1hive/connect-gardens'

import { ActivityProvider } from './ActivityProvider'
import { AgreementSubscriptionProvider } from './AgreementSubscription'
import { ConnectProvider as Connect } from './Connect'
import { GardenStateProvider } from './GardenState'
import { StakingProvider } from './Staking'

import { fetchFileContent } from '../services/github'

import { DAONotFound } from '../errors'
import { getGardenForumUrl } from '../utils/garden-utils'
import useGardenFilters from '@/hooks/useGardenFilters'
import { testNameFilter } from '@/utils/garden-filters-utils'
import { useDebounce } from '@/hooks/useDebounce'
import { useMounted } from '@/hooks/useMounted'

import { getVoidedGardensByNetwork } from '../voided-gardens'
import { useWallet } from './Wallet'

const DAOContext = React.createContext()

export function GardensProvider({ children }) {
  const { preferredNetwork } = useWallet()
  const [queryFilters, filters] = useGardenFilters()
  const [gardens, gardensMetadata, gardensLoading, reload] = useGardensList(
    queryFilters,
    filters,
    preferredNetwork
  )
  const match = useRouteMatch('/garden/:daoId')
  const [connectedGarden, connectedGardenLoading] = useGarden(
    match?.params.daoId,
    gardensMetadata,
    preferredNetwork
  )

  if (match && !connectedGarden && !connectedGardenLoading) {
    throw new DAONotFound(match.params.daoId)
  }

  return (
    <DAOContext.Provider
      value={{
        connectedGarden,
        internalFilters: filters,
        externalFilters: queryFilters,
        gardens,
        gardensMetadata,
        loading: connectedGardenLoading || gardensLoading,
        reload,
      }}
    >
      {connectedGarden ? (
        <Connect>
          <ActivityProvider>
            <GardenStateProvider>
              <StakingProvider>
                <AgreementSubscriptionProvider>
                  {children}
                </AgreementSubscriptionProvider>
              </StakingProvider>
            </GardenStateProvider>
          </ActivityProvider>
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

function useGarden(id, gardensMetadata, chainId) {
  const [garden, setGarden] = useState()
  const [loading, setLoading] = useState(true)
  const mounted = useMounted()

  useEffect(() => {
    if (!id || !gardensMetadata?.length) {
      return
    }
    const fetchGarden = async () => {
      setLoading(true)
      try {
        const result = await getGarden({ network: chainId }, id)

        setGarden(mergeGardenMetadata(result, gardensMetadata))
      } catch (err) {
        if (mounted()) {
          setGarden()
        }
        console.error(err)
      }

      setLoading(false)
    }

    fetchGarden()
  }, [chainId, id, gardensMetadata, mounted])

  return [garden, loading]
}

function useFilteredGardens(gardens, gardensMetadata, filters, chainId) {
  const debouncedNameFilter = useDebounce(filters.name.filter, 300)

  return useMemo(() => {
    const mergedGardens = gardens.map(garden =>
      mergeGardenMetadata(garden, gardensMetadata, chainId)
    )
    if (!debouncedNameFilter) {
      return mergedGardens
    }
    return mergedGardens.filter(garden =>
      testNameFilter(debouncedNameFilter, garden)
    )
  }, [chainId, debouncedNameFilter, gardens, gardensMetadata])
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
  const filteredGardens = useFilteredGardens(
    gardens,
    gardensMetadata,
    filters,
    chainId
  )

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

function mergeGardenMetadata(garden, gardensMetadata, chainId) {
  const metadata =
    gardensMetadata?.find(dao => addressesEqual(dao.address, garden.id)) || {}

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
    chainId,
    forumURL,
    token,
    wrappableToken,
  }
}
