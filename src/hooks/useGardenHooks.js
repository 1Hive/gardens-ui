import { useEffect, useMemo, useState } from 'react'

import { connectGarden } from '@1hive/connect-gardens'
import connectAgreement from '@aragon/connect-agreement'
import {
  createAppHook,
  useApps,
  useOrganization,
  usePermissions,
} from '@1hive/connect-react'
import { useContractReadOnly } from './useContract'
import { useConfigSubscription } from './useSubscriptions'

// utils
import env from '@/environment'
import BigNumber from '@lib/bigNumber'
import { addressesEqual } from '@utils/web3-utils'
import { getAppAddressByName, getAppByName } from '@utils/data-utils'
import { connectorConfig } from '@/networks'

// abis
import minimeTokenAbi from '@abis/minimeToken.json'
import vaultAbi from '@abis/vault-balance.json'

const useAgreementHook = createAppHook(
  connectAgreement,
  connectorConfig.agreement
)

export function useGardenData() {
  const [garden, setGarden] = useState(null)
  const [organization, orgStatus] = useOrganization()
  const [apps, appsStatus] = useApps()

  const agreementApp = getAppByName(apps, env('AGREEMENT_APP_NAME'))
  const convictionApp = getAppByName(apps, env('CONVICTION_APP_NAME'))
  const [
    connectedAgreementApp,
    { error: agreementError, loading: agreementAppLoading },
  ] = useAgreementHook(agreementApp)

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

    const fetchGardenConnector = async () => {
      try {
        const gardenConnector = await connectGarden(organization)

        if (!cancelled) {
          setGarden(gardenConnector)
        }
      } catch (err) {
        console.error(`Error fetching honey pot connector: ${err}`)
      }
    }

    fetchGardenConnector()

    return () => {
      cancelled = true
    }
  }, [organization])

  const config = useConfigSubscription(garden)

  const loading =
    orgStatus.loading ||
    appsStatus.loading ||
    permissionsStatus.loading ||
    agreementAppLoading ||
    !config

  const errors =
    orgStatus.error ||
    appsStatus.error ||
    permissionsStatus.error ||
    agreementError

  return {
    config,
    connectedAgreementApp,
    errors,
    garden,
    installedApps: apps,
    loading,
    organization,
    permissions: convictionAppPermissions,
  }
}

export function useCommonPool(installedApps, token, timeout = 3000) {
  const vaultAddress =
    getAppAddressByName(installedApps, 'vault') ||
    getAppAddressByName(installedApps, 'agent')
  const vaultContract = useContractReadOnly(vaultAddress, vaultAbi)

  const [commonPool, setCommonPool] = useState(new BigNumber(-1))

  useEffect(() => {
    let cancelled = false
    let timeoutId

    if (!vaultContract || !token?.id) {
      return
    }

    const pollCommonPool = async () => {
      try {
        const commonPoolResult = await vaultContract.balance(token.id)

        if (!cancelled) {
          // Contract value is bn.js so we need to convert it to bignumber.js
          const newValue = new BigNumber(commonPoolResult.toString())

          if (!newValue.eq(commonPool)) {
            setCommonPool(newValue)
          }
        }
      } catch (err) {
        console.error(`Error fetching vault balance: ${err} retrying...`)
      }

      if (!cancelled) {
        timeoutId = setTimeout(pollCommonPool, timeout)
      }
    }

    pollCommonPool()

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [commonPool, timeout, token, vaultContract])

  return commonPool
}

export function useTokenBalances(account, token, timeout = 3000) {
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

    const pollAccountBalance = async () => {
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
      if (!cancelled) {
        timeoutId = setTimeout(pollAccountBalance, timeout)
      }
    }

    pollAccountBalance()

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [account, balances, timeout, tokenContract, token])

  return balances
}
