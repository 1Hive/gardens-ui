import { useEffect, useMemo, useRef, useState } from 'react'

import connectHoneypot from '@1hive/connect-honey-pot'
import {
  useApp,
  useApps,
  useOrganization,
  usePermissions,
} from '@aragon/connect-react'
import { useContractReadOnly } from './useContract'
import { useConfigSubscription } from './useSubscriptions'

// utils
import env from '../environment'
import BigNumber from '../lib/bigNumber'
import { addressesEqual } from '../lib/web3-utils'
import { getAppAddressByName } from '../lib/data-utils'

// abis
import minimeTokenAbi from '../abi/minimeToken.json'
import vaultAbi from '../abi/vault-balance.json'

// const DEFAULT_ORG_DATA = {
//   honeypot: null,
//   installedApps: [],
//   organization: null,
//   permissions: [],
//   loadingAppData: true,
// }

export function useOrgData() {
  const appName = env('APP_NAME')

  const [honeyPot, setHoneyPot] = useState(null)
  const [organization, orgStatus] = useOrganization()
  const [apps, appsStatus] = useApps()
  const [convictionApp] = useApp(appName)
  const [permissions, permissionsStatus] = usePermissions()

  const convictionAppPermissions = useMemo(() => {
    if (
      !permissions ||
      permissionsStatus.loading ||
      permissionsStatus.error ||
      !convictionApp
    ) {
      return
    }
    return permissions.filter(({ appAddress }) =>
      addressesEqual(appAddress, convictionApp.address)
    )
  }, [convictionApp, permissions, permissionsStatus])

  useEffect(() => {
    if (!organization) {
      return
    }

    let cancelled = false

    const fetchHoneyPotConnector = async () => {
      try {
        const honeypotConnector = await connectHoneypot(organization)
        // console.log('honeypotData ', honeypotData)

        if (!cancelled) {
          setHoneyPot(() => honeypotConnector)
        }
      } catch (err) {
        console.error(`Error fetching honey pot connector: ${err}`)
      }
    }

    fetchHoneyPotConnector()

    return () => {
      cancelled = true
    }
  }, [organization, honeyPot])

  const config = useConfigSubscription(honeyPot)

  const loadingData =
    orgStatus.loading ||
    appsStatus.loading ||
    permissionsStatus.loading ||
    !config

  console.log('loadingData ', loadingData)
  return {
    config: config,
    honeypot: honeyPot,
    installedApps: apps,
    organization: organization,
    permissions: convictionAppPermissions,
    loadingAppData: loadingData,
  }

  // return { ...appData, config, organization }
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
