import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { addressesEqual } from '@1hive/1hive-ui'
import { getGardens } from '@1hive/connect-gardens'
import daoList from '@1hive/gardens-dao-list'

import { useWallet } from '../providers/Wallet'
import { DAONotFound } from '../errors'

const DAOContext = React.createContext()

function getConnectedAccountBalance(account, dao) {
  return 0
}

export function DAOProvider({ children }) {
  const { account } = useWallet()
  const daos = useDaos()

  const match = useRouteMatch('/garden/:daoId')
  let connectedDao

  if (match) {
    const daoAddress = match.params.daoId
    connectedDao = daoList.daos.find(d => addressesEqual(daoAddress, d.address))

    if (!connectedDao) {
      throw new DAONotFound(match.params.daoId)
    }
  }

  // somehow here we are going to get the dao token info and the user balance for the dao
  const accountBalance = getConnectedAccountBalance(account, connectedDao)
  const stakeToken = {}

  const DAOInfo = {
    daos,
    connectedDao: connectedDao && {
      ...connectedDao,
      stakeToken,
      accountBalance,
    },
  }

  return <DAOContext.Provider value={DAOInfo}>{children}</DAOContext.Provider>
}

export function useDAO() {
  return useContext(DAOContext)
}

function useDaos() {
  const [daos, setDaos] = useState([])

  useEffect(() => {
    const fetchDaos = async () => {
      try {
        const result = await getGardens()
        setDaos(result)
      } catch (err) {
        console.error(`Error fetching daos ${err}`)
      }
    }

    fetchDaos()
  }, [daos])

  return useMemo(() => daos.map(addDaoMetadata), [daos])
}

function addDaoMetadata(dao) {
  const metadata = daoList.daos.find(d => d.address === dao.address) || {}

  return {
    ...dao,
    ...metadata,
  }
}
