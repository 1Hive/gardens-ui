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

  console.log('CALLING PROVIDER AGAIN ', loading)
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
  const [loadingMetadata, setLoadingMetadata] = useState(true)
  const { preferredNetwork } = useWallet()

  useEffect(() => {
    setLoading(true)
    setLoadingMetadata(true)
  }, [preferredNetwork])

  useEffect(() => {
    const fetchGardens = async () => {
      try {
        const result = await getGardens(
          { network: preferredNetwork },
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
  }, [preferredNetwork])

  useEffect(() => {
    const fetchGardenMetadata = async () => {
      try {
        const result = await fetchFileContent(preferredNetwork)
        setGardensMetadata(result.data)
      } catch (err) {
        setGardensMetadata([])
        console.error(`Error fetching gardens metadata ${err}`)
      }
      setLoadingMetadata(false)
    }
    fetchGardenMetadata()
  }, [preferredNetwork])

  return [
    useMemo(
      () =>
        gardens.map(garden =>
          mergeGardenMetadata(garden, gardensMetadata, preferredNetwork)
        ),
      [gardens, gardensMetadata, preferredNetwork]
    ),
    loading || loadingMetadata,
  ]
}

function mergeGardenMetadata(garden, gardensMetadata, networkId) {
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
    chainId: networkId,
  }
}
