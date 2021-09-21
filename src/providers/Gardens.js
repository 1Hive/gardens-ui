import React, { useContext, useEffect, useMemo, useState } from 'react'
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

const DAOContext = React.createContext()

export function GardensProvider({ children }) {
  const [queryFilters, filters] = useGardenFilters()
  const [gardens, loading] = useGardensList(queryFilters, filters)

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
  const debouncedNameFilter = useDebounce(filters.name.filter, 500)

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
  const { network, sorting } = queryFilters

  useEffect(() => {
    setLoadingMetadata(true)
  }, [])

  useEffect(() => {
    const fetchGardens = async () => {
      try {
        setLoading(true)

        const result = await getGardens(
          { ...network.queryArgs },
          { ...sorting.queryArgs }
        )
        setGardens(result)
      } catch (err) {
        setGardens([])
        console.error(`Error fetching gardens ${err}`)
      }
      setLoading(false)
    }

    fetchGardens()
  }, [network.queryArgs, sorting.queryArgs])

  useEffect(() => {
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
  }, [])

  return [
    useMemo(
      () =>
        filteredGardens.map(garden =>
          mergeGardenMetadata(garden, gardensMetadata)
        ),
      [filteredGardens, gardensMetadata]
    ),
    loading || loadingMetadata,
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
