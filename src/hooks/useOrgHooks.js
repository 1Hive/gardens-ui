import { useEffect, useRef, useState } from 'react'

import connectConviction from '@1hive/connect-conviction-voting'
import { connect } from '@aragon/connect'
import { useContractReadOnly } from './useContract'
import {
  useProposalsSubscription,
  useStakesHistorySubscription,
} from './useSubscriptions'
import { useWallet } from '../providers/Wallet'

// utils
import { getNetwork } from '../networks'
import BigNumber from '../lib/bigNumber'
import { addressesEqual } from '../lib/web3-utils'
import { getDefaultChain } from '../local-settings'
import { transformConfigData, getAppAddressByName } from '../lib/data-utils'

// abis
import minimeTokenAbi from '../abi/minimeToken.json'
import vaultAbi from '../abi/vault-balance.json'

// Convcition voting
const APP_NAME = 'conviction-beta' // TODO: save elsewhere

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
  const { ethereum, ethers } = useWallet()

  useEffect(() => {
    let cancelled = false
    const fetchOrg = async () => {
      const orgAddress = getNetwork().honeypot
      const organization = await connect(orgAddress, 'thegraph', {
        ethereum: ethereum || ethers,
        network: getDefaultChain(),
      })

      if (!cancelled) {
        setOrganization(organization)
      }
    }

    fetchOrg()

    return () => {
      cancelled = true
    }
  }, [ethers, ethereum])

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
      const permissions = await organization.permissions()

      const convictionApp = apps.find(app => app.name === APP_NAME)

      const convictionAppPermissions = permissions.filter(({ appAddress }) =>
        addressesEqual(appAddress, convictionApp.address)
      )

      const convictionVoting = await connectConviction(convictionApp)

      const config = await convictionVoting.config()

      if (!cancelled) {
        setAppData(appData => ({
          ...appData,
          ...transformConfigData(config),
          installedApps: apps,
          convictionVoting,
          organization,
          permissions: convictionAppPermissions,
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
          const vaultContractBalance = await vaultContract.balance(token.id)

          if (!cancelled) {
            // Contract value is bn.js so we need to convert it to bignumber.js
            const newValue = new BigNumber(vaultContractBalance.toString())

            if (!newValue.eq(vaultBalance)) {
              setVaultBalance(newValue)
            }
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
  }, [vaultBalance, vaultContract, controlledTimeout, timeout, token.id])

  return vaultBalance
}

export function useTokenBalances(account, token, timer = 3000) {
  const [balances, setBalances] = useState({
    balance: new BigNumber(-1),
    totalSupply: new BigNumber(-1),
  })

  const tokenContract = useContractReadOnly(token.id, minimeTokenAbi)

  useEffect(() => {
    if (!token.id) {
      return
    }

    let cancelled = false
    let timeoutId

    const fetchAccountStakeBalance = async () => {
      try {
        let contractNewBalance = new BigNumber(-1)
        if (account) {
          contractNewBalance = await tokenContract.balanceOf(account)
        }

        const contractTotalSupply = await tokenContract.totalSupply()

        if (!cancelled) {
          // Contract value is bn.js so we need to convert it to bignumber.js
          const newBalance = new BigNumber(contractNewBalance.toString())
          const newTotalSupply = new BigNumber(contractTotalSupply.toString())

          if (
            !newTotalSupply.eq(balances.totalSupply) ||
            !newBalance.eq(balances.balance)
          ) {
            setBalances({ balance: newBalance, totalSupply: newTotalSupply })
          }
        }
      } catch (err) {
        console.error(`Error fetching balance: ${err} retrying...`)
      }
    }

    fetchAccountStakeBalance()

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [account, balances, tokenContract, token.id])

  return balances
}
