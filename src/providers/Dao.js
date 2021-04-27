import React, { useContext } from 'react'
import { addressesEqual } from '@1hive/1hive-ui'
import { useLocation } from 'react-router-dom'
import daoList from '@1hive/gardens-dao-list'

import { useWallet } from '../providers/Wallet'

const DAOContext = React.createContext()

export function parsePath(pathname, search = '') {
  const [, ...parts] = pathname.split('/')

  return parts[0]
}

function getConnectedAccountBalance(account, dao) {
  return 0
}

export function DAOProvider({ children }) {
  const location = useLocation()
  const { account } = useWallet()

  // get all the daos for the dashboard

  // note that i am calling this daoId because at some point we might want to also handle aragon id's and not just addresses
  const firstParameter = parsePath(location.pathname)

  const connectedDAO = daoList.daos.find(d =>
    addressesEqual(firstParameter, d.address)
  )

  // somehow here we are going to get the dao token info and the user balance for the dao
  const connectedAccountBalance = getConnectedAccountBalance(
    account,
    connectedDAO
  )
  const stakeToken = {}

  const DAOInfo = {
    gardensList: daoList.daos,
    connectedDAO: connectedDAO && {
      ...connectedDAO,
      stakeToken,
      connectedAccountBalance,
    },
  }

  return <DAOContext.Provider value={DAOInfo}>{children}</DAOContext.Provider>
}

export function useDAO() {
  return useContext(DAOContext)
}
