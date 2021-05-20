import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { addressesEqual } from '@1hive/1hive-ui'
import { getGardens } from '@1hive/connect-gardens'
import daoList from '@1hive/gardens-dao-list'
import { DAONotFound } from '../errors'
import { AppStateProvider } from './AppState'
import { ConnectProvider as Connect } from './Connect'

import { getNetwork } from '../networks'

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
          <AppStateProvider>{children}</AppStateProvider>
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
        const result = await getGardens({ network: getNetwork().chainId }, {})
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
  return {
    ...garden,
    ...metadata,
    token,
    address: garden.id,
  }
}
