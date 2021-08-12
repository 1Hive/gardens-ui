import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { addressesEqual } from '@1hive/1hive-ui'
import { getGardens } from '@1hive/connect-gardens'

import { AgreementSubscriptionProvider } from './AgreementSubscription'
import { ConnectProvider as Connect } from './Connect'
import { GardenStateProvider } from './GardenState'
import { StakingProvider } from './Staking'
import { useWallet } from './Wallet'

import { fetchFileContent } from '../services/github'
import { DAONotFound } from '../errors'
import { getGardenForumUrl } from '../utils/garden-utils'

const DAOContext = React.createContext()

export function GardensProvider({ children }) {
  const [gardens, loading] = useGardensList()

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
    <DAOContext.Provider value={{ connectedGarden, gardens, loading }}>
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
  const { chainId, preferredNetwork, isSupportedNetwork } = useWallet()

  const networkId = isSupportedNetwork ? chainId : preferredNetwork

  useEffect(() => {
    const fetchGardens = async () => {
      try {
        const result = await getGardens(
          { network: networkId },
          { orderBy: 'honeyLiquidity' }
        )
        setGardens(result)
      } catch (err) {
        setGardens([])
        console.error(`Error fetching gardens ${err}`)
      }
      setLoading(false)
    }

    fetchGardens()
  }, [networkId, isSupportedNetwork, preferredNetwork])

  useEffect(() => {
    const fetchGardenMetadata = async () => {
      try {
        const result = await fetchFileContent(networkId)
        setGardensMetadata(result.data)
      } catch (err) {
        setGardensMetadata([])
        console.error(`Error fetching gardens metadata ${err}`)
      }
    }
    fetchGardenMetadata()
  }, [networkId, isSupportedNetwork, preferredNetwork])

  return [
    useMemo(
      () =>
        gardens.map(garden =>
          mergeGardenMetadata(garden, gardensMetadata, networkId)
        ),
      [gardens, gardensMetadata, networkId]
    ),
    loading,
  ]
}

function mergeGardenMetadata(garden, gardensMetadata, networkId) {
  const metadata =
    gardensMetadata.gardens.find(dao =>
      addressesEqual(dao.address, garden.id)
    ) || {}

  const token = {
    ...garden.token,
    ...metadata.token,
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
    chainId: networkId,
  }
}
