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

import { getVoidedGardensByNetwork } from '../voided-gardens'

const DAOContext = React.createContext()

export function GardensProvider({ children }) {
  const [gardens, loading, reload] = useGardensList()

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
    <DAOContext.Provider value={{ connectedGarden, gardens, loading, reload }}>
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

function useGardensList() {
  const [gardens, setGardens] = useState([])
  const [gardensMetadata, setGardensMetadata] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMetadata, setLoadingMetadata] = useState(true)
  const [refetchTriger, setRefetchTriger] = useState(false)

  const reload = useCallback(() => {
    setRefetchTriger(triger => setRefetchTriger(!triger))
  }, [])

  useEffect(() => {
    setLoading(true)
    const fetchGardens = async () => {
      try {
        const result = await getGardens(
          { network: getNetwork().chainId },
          { orderBy: 'honeyLiquidity' }
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
  }, [refetchTriger])

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
      () => gardens.map(garden => mergeGardenMetadata(garden, gardensMetadata)),
      [gardens, gardensMetadata]
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
