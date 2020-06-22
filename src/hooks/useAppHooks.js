import { useEffect, useRef, useState } from 'react'
import gql from 'graphql-tag'
import { GraphQLWrapper } from '@aragon/connect-thegraph'

import { useContractReadOnly } from './useContract'

import BigNumber from '../lib/bigNumber'
import { getAppAddressByName } from '../lib/data-utils'
import vaultAbi from '../abi/vault-balance.json'

const TOKEN_MANAGER_SUBGRAPH =
  'https://api.thegraph.com/subgraphs/name/1hive/aragon-tokens-xdai'
const TOKEN_HOLDER_QUERY = `
query miniMeToken($id: String!, $address: String!) {
  miniMeToken(id: $id){
    id
    totalSupply
    holders(where: {address: $address}){
      address
      balance
    }
  }
}
`

export function useVaultBalance(installedApps, token, timeout = 1000) {
  const vaultAddress = getAppAddressByName(installedApps, 'vault')
  const vaultContract = useContractReadOnly(vaultAddress, vaultAbi)

  const [vaultBalance, setVaultBalance] = useState(new BigNumber(-1))

  // We are starting in 0 in order to immediately make the fetch call
  const controlledTimeout = useRef(0)

  useEffect(() => {
    let cancelled = false
    let timeoutId

    if (!vaultContract) {
      return
    }

    const fetchVaultBalance = () => {
      timeoutId = setTimeout(async () => {
        try {
          const vaultBalance = await vaultContract.balance(token.id)

          if (!cancelled) {
            setVaultBalance(vaultBalance)
          }
        } catch (err) {
          console.error(`Error fetching balance: ${err} retrying...`)
        }

        if (!cancelled) {
          clearTimeout(timeoutId)
          controlledTimeout.current = timeout
          fetchVaultBalance()
        }
      }, controlledTimeout.current)
    }

    fetchVaultBalance()

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [vaultContract, controlledTimeout, timeout, token.id])

  return vaultBalance
}

export function useTokenBalances(account, token) {
  const [balances, setBalances] = useState({
    balance: new BigNumber(-1),
    totalSupply: new BigNumber(-1),
  })

  useEffect(() => {
    if (!account || !token.id) {
      return
    }

    let cancelled = false

    const queryAccountStakeBalance = async () => {
      const wrapper = new GraphQLWrapper(TOKEN_MANAGER_SUBGRAPH)
      const results = await wrapper.performQuery(gql(TOKEN_HOLDER_QUERY), {
        id: `tokenAddress-${token.id}`,
        address: account,
      })

      if (!results.data) {
        return
      }

      const { miniMeToken } = results.data

      if (!cancelled) {
        setBalances({
          balance: new BigNumber(miniMeToken.holders[0]?.balance || 0),
          totalSupply: new BigNumber(miniMeToken.totalSupply),
        })
      }
    }

    queryAccountStakeBalance()

    return () => (cancelled = true)
  }, [account, token.id])

  return balances
}
