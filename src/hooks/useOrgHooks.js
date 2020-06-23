import { useEffect, useRef, useState } from 'react'
import gql from 'graphql-tag'
import { GraphQLWrapper } from '@aragon/connect-thegraph'
import { providers as EthersProviders } from 'ethers'

import { ConvictionVoting } from '@1hive/connect-thegraph-conviction-voting'
import { connect } from '@aragon/connect'
import { getDefaultChain } from '../local-settings'
import { transformConfigData, getAppAddressByName } from '../lib/data-utils'
import { useContractReadOnly } from './useContract'

import BigNumber from '../lib/bigNumber'

import vaultAbi from '../abi/vault-balance.json'
import { useWallet } from '../providers/Wallet'
import {
  useProposalsSubscription,
  useStakesHistorySubscription,
} from './useSubscriptions'

// Endpoints TODO: Move to endpoints file

// Organzation
const ORG_ADDRESS = '0xe03f1aa34886a753d4e546c870d7f082fdd2fa9b'
const ORG_SUBRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/1hive/aragon-xdai'

// Convcition voting
const APP_NAME = 'conviction-voting'
const APP_SUBRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/1hive/aragon-conviction-voting-xdai'

// Tokens app
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

const DEFAULT_APP_DATA = {
  convictionVoting: null,
  stakeToken: {},
  requestToken: {},
  proposals: [],
  stakesHistory: [],
  alpha: BigNumber(0),
  maxRatio: BigNumber(0),
  weight: BigNumber(0),
}

export function useOrganzation() {
  const [organzation, setOrganization] = useState(null)
  const { ethereum } = useWallet()

  useEffect(() => {
    let cancelled = false
    const fetchOrg = async () => {
      const organization = await connect(
        ORG_ADDRESS,
        [
          'thegraph',
          {
            orgSubgraphUrl: ORG_SUBRAPH_URL,
          },
        ],
        {
          readProvider:
            ethereum ||
            new EthersProviders.JsonRpcProvider('https://xdai.poanetwork.dev/'), // TODO: Remove once connect doesn't require a provider if it's not going to use it
          chainId: getDefaultChain(),
        }
      )

      if (!cancelled) {
        setOrganization(organization)
      }
    }

    fetchOrg()

    return () => {
      cancelled = true
    }
  }, [ethereum])

  return organzation
}

export function useAppData(organization) {
  const [appData, setAppData] = useState(DEFAULT_APP_DATA)

  useEffect(() => {
    if (!organization) {
      return
    }

    let cancelled = false

    const fetchAppData = async () => {
      const apps = await organization.apps()

      const convictionApp = apps.find(app => app.name === APP_NAME)

      const convictionVoting = new ConvictionVoting(
        convictionApp.address,
        APP_SUBRAPH_URL
      )

      const config = await convictionVoting.config()

      if (!cancelled) {
        setAppData(appData => ({
          ...appData,
          ...transformConfigData(config),
          installedApps: apps,
          convictionVoting,
          organization,
        }))
      }
    }

    fetchAppData()

    return () => {
      cancelled = true
    }
  }, [organization])

  const proposals = useProposalsSubscription(appData.convictionVoting)

  // Stakes done across all proposals on this app
  // Includes old and current stakes
  const stakesHistory = useStakesHistorySubscription(appData.convictionVoting)

  return { ...appData, proposals, stakesHistory }
}

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
            // Contract value is bn.js so we need to convert it to bignumber.js
            setVaultBalance(new BigNumber(vaultBalance.toString()))
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
    if (!token.id) {
      return
    }

    let cancelled = false

    const queryAccountStakeBalance = async () => {
      const wrapper = new GraphQLWrapper(TOKEN_MANAGER_SUBGRAPH)
      const results = await wrapper.performQuery(gql(TOKEN_HOLDER_QUERY), {
        id: `tokenAddress-${token.id}`,
        address: account || '',
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
