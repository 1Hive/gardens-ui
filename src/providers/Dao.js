import React, { useContext } from 'react'
import { addressesEqual } from '@1hive/1hive-ui'
import { useLocation } from 'react-router-dom'
import daoList from '@1hive/gardens-dao-list'
import { isAddress } from '../utils/web3-utils'
import { DAONotFound } from '../errors'

const DAOContext = React.createContext()

export function parsePath(pathname, search = '') {
  const [, ...parts] = pathname.split('/')

  return parts[0]
}

export function DAOProvider({ children }) {
  const location = useLocation()

  // note that i am calling this daoId because at some point we might want to also handle aragon id's and not just addresses
  const firstParameter = parsePath(location.pathname)
  const validAddress = isAddress(firstParameter)
  const dao = daoList.daos.find(d => addressesEqual(firstParameter, d.address))

  if (!validAddress || !dao) {
    throw new DAONotFound(firstParameter)
  }

  return <DAOContext.Provider value={dao}>{children}</DAOContext.Provider>
}

export function useDAO() {
  return useContext(DAOContext)
}
