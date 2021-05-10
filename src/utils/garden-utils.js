import daoList from '@1hive/gardens-dao-list'
import { addressesEqual } from './web3-utils'

export function getGardenLabel(address) {
  const dao = daoList.daos.find(dao => addressesEqual(dao.address, address))
  return dao?.name || address
}
