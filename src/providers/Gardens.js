import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { addressesEqual } from '@1hive/1hive-ui'
import { getGardens } from '@1hive/connect-gardens'
import daoList from '@1hive/gardens-dao-list'
import { DAONotFound } from '../errors'
import { AppStateProvider } from '../providers/AppState'
import { ConnectProvider as Connect } from '../providers/Connect'

import { useTokenBalances } from '../hooks/useOrgHooks'
import { useWallet } from './Wallet'
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

  if (connectedGarden) {
    return (
      <WithConnectedGarden connectedGarden={connectedGarden} gardens={gardens}>
        {children}
      </WithConnectedGarden>
    )
  }

  if (match && !loading) {
    throw new DAONotFound(match.params.daoId)
  }

  return (
    <DAOContext.Provider value={{ gardens, loading }}>
      {children}
    </DAOContext.Provider>
  )
}

function WithConnectedGarden({ children, connectedGarden, gardens }) {
  const { account } = useWallet()
  const { balance, totalSupply } = useTokenBalances(
    account,
    connectedGarden.token
  )

  return (
    <DAOContext.Provider
      value={{
        gardens,
        connectedGarden: {
          ...connectedGarden,
          accountBalance: balance,
          totalSupply,
        },
      }}
    >
      <Connect>
        <AppStateProvider>{children}</AppStateProvider>
      </Connect>
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
