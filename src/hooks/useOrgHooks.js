import { useEffect, useRef, useState } from 'react'

import connectHoneypot from '@1hive/connect-honey-pot'
import { connect } from '@aragon/connect'
import { useContractReadOnly } from './useContract'
import { useConfigSubscription } from './useSubscriptions'
import { useWallet } from '../providers/Wallet'

// utils
import env from '../environment'
import { getNetwork } from '../networks'
import BigNumber from '../lib/bigNumber'
import { addressesEqual } from '../lib/web3-utils'
import { getDefaultChain } from '../local-settings'
import { getAppAddressByName } from '../lib/data-utils'

// abis
import minimeTokenAbi from '../abi/minimeToken.json'
import vaultAbi from '../abi/vault-balance.json'

const DEFAULT_APP_DATA = {
  honeypot: null,
  installedApps: [],
  organization: null,
  permissions: [],
}

export function useOrganzation() {
  const [organzation, setOrganization] = useState(null)
  const { ethereum, ethers } = useWallet()

  useEffect(() => {
    let cancelled = false
    const fetchOrg = async () => {
      try {
        const orgAddress = getNetwork().honeypot
        const organization = await connect(orgAddress, 'thegraph', {
          ethereum: ethereum || ethers,
          network: getDefaultChain(),
        })

        if (!cancelled) {
          setOrganization(organization)
        }
      } catch (err) {
        console.error(`Error fetching organization: ${err}`)
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
  const appName = env('APP_NAME')

  useEffect(() => {
    if (!organization) {
      return
    }

    let cancelled = false

    const fetchAppData = async () => {
      try {
        const apps = await organization.apps()
        const permissions = await organization.permissions()
        const convictionApp = apps.find(app => app.name === appName)
        const convictionAppPermissions = permissions.filter(({ appAddress }) =>
          addressesEqual(appAddress, convictionApp.address)
        )

        const honeypot = await connectHoneypot(organization)

        if (!cancelled) {
          setAppData(appData => ({
            ...appData,
            honeypot,
            installedApps: apps,
            organization,
            permissions: convictionAppPermissions,
          }))
        }
      } catch (err) {
        console.error(`Error fetching app data: ${err}`)
      }
    }

    fetchAppData()

    return () => {
      cancelled = true
    }
  }, [appName, organization])

  const config = useConfigSubscription(appData.honeypot)

  return { ...appData, config }
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

    if (!vaultContract || !token?.id) {
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
  }, [vaultBalance, vaultContract, controlledTimeout, timeout, token])

  return vaultBalance
}

export function useTokenBalances(account, token, timer = 3000) {
  const [balances, setBalances] = useState({
    balance: new BigNumber(-1),
    totalSupply: new BigNumber(-1),
  })

  const tokenContract = useContractReadOnly(token?.id, minimeTokenAbi)

  useEffect(() => {
    if (!token?.id || !tokenContract) {
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
  }, [account, balances, tokenContract, token])

  return balances
}
