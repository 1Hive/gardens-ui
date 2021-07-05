import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { addressesEqual } from '@1hive/1hive-ui'
import daoList from '@1hive/gardens-dao-list'
import { getGardens } from '@1hive/connect-gardens'

import { AgreementSubscriptionProvider } from './AgreementSubscription'
import { ConnectProvider as Connect } from './Connect'
import { GardenStateProvider } from './GardenState'
import { StakingProvider } from './Staking'

import { DAONotFound } from '../errors'
import { getNetwork } from '../networks'
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGardens = async () => {
      try {
        const result = await getGardens(
          { network: getNetwork().chainId },
          { orderBy: 'honeyLiquidity' }
        )
        setGardens(result)
      } catch (err) {
        console.error(`Error fetching daos ${err}`)
      }
      setLoading(false)
    }

    fetchGardens()
  }, [])

  return [useMemo(() => gardens.map(mergeGardenMetadata), [gardens]), loading]
}

function mergeGardenMetadata(garden) {
  const metadata =
    daoList.daos.find(dao => addressesEqual(dao.address, garden.id)) || {}

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
  }
}
