import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { addressesEqual } from '@1hive/1hive-ui'
import { getGardens } from '@1hive/connect-gardens'
import daoList from '@1hive/gardens-dao-list'
import { DAONotFound } from '../errors'

import { useTokenBalances } from '../hooks/useOrgHooks'
import { useWallet } from './Wallet'
import { getNetwork } from '../networks'

const DAOContext = React.createContext()

export function GardensProvider({ children }) {
  const { account } = useWallet()
  const [gardens, loading] = useGardensList()

  const match = useRouteMatch('/garden/:daoId')

  const connectedGarden = useMemo(() => {
    if (!loading && match) {
      const gardenAddress = match.params.daoId
      return gardens.find(d => addressesEqual(gardenAddress, d.address))
    }

    return {}
  }, [gardens, loading, match])

  if (!connectedGarden) {
    throw new DAONotFound(match.params.daoId)
  }

  // somehow here we are going to get the dao token info and the user balance for the dao
  const { balance, totalSupply } = useTokenBalances(
    account,
    connectedGarden.token
  )

  const DAOInfo = {
    gardens,
    connectedGarden: {
      ...connectedGarden,
      balance,
      totalSupply,
    },
  }

  return <DAOContext.Provider value={DAOInfo}>{children}</DAOContext.Provider>
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
    daoList.daos.find(dao => dao.address === garden.address) || {}

  return {
    ...garden,
    ...metadata,
    address: garden.id,
  }
}
