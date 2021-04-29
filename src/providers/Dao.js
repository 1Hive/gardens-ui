import React, { useContext } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { addressesEqual } from '@1hive/1hive-ui'
import daoList from '@1hive/gardens-dao-list'

import { useWallet } from '../providers/Wallet'
import { DAONotFound } from '../errors'

const DAOContext = React.createContext()

function getConnectedAccountBalance(account, dao) {
  return 0
}

export function DAOProvider({ children }) {
  // const location = useLocation()
  const { account } = useWallet()

  // get all the daos for the dashboard

  // note that i am calling this daoId because at some point we might want to also handle aragon id's and not just addresses
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
    daoList: daoList.daos,
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
