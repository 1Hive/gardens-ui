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
import { addressesEqual } from '../utils/web3-utils'
import { getAppAddressByName } from '../utils/data-utils'

// abis
import minimeTokenAbi from '../abi/minimeToken.json'
import vaultAbi from '../abi/vault-balance.json'

export function useOrgData() {
  const appName = env('CONVICTION_APP_NAME')

  const [honeypot, setHoneypot] = useState(null)
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

    const fetchHoneypotConnector = async () => {
      try {
        const honeypotConnector = await connectHoneypot(organization)

        if (!cancelled) {
          setHoneypot(honeypotConnector)
        }
      } catch (err) {
        console.error(`Error fetching honey pot connector: ${err}`)
      }
    }

    fetchHoneypotConnector()

    return () => {
      cancelled = true
    }
  }, [organization])

  const config = useConfigSubscription(honeypot)

  const loadingData =
    orgStatus.loading ||
    appsStatus.loading ||
    permissionsStatus.loading ||
    !config

  const errors = orgStatus.error || appsStatus.error || permissionsStatus.error

  return {
    config,
    errors,
    honeypot,
    installedApps: apps,
    organization,
    permissions: convictionAppPermissions,
    loadingAppData: loadingData,
  }
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
