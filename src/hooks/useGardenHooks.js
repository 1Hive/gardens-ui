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
import { getAppByName } from '@utils/data-utils'
import { connectorConfig } from '@/networks'

// abis
import minimeTokenAbi from '@abis/minimeToken.json'
import vaultAbi from '@abis/vault-balance.json'

const INITIAL_TIMER = 2000

const useAgreementHook = createAppHook(
  connectAgreement,
  connectorConfig.agreement
)

export function useGardenData() {
  const [connector, setConnector] = useState(null)
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
          setConnector(gardenConnector)
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

  const config = useConfigSubscription(connector)

  const errors =
    orgStatus.error ||
    appsStatus.error ||
    permissionsStatus.error ||
    agreementError

  const loading =
    !errors &&
    (orgStatus.loading ||
      appsStatus.loading ||
      permissionsStatus.loading ||
      agreementAppLoading ||
      !config)

  return {
    config,
    connectedAgreementApp,
    connector,
    errors,
    installedApps: apps,
    loading,
    organization,
    permissions: convictionAppPermissions,
  }
}

export function useCommonPool(vaultAddress, token, timeout = 8000) {
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
        // Contract value is bn.js so we need to convert it to bignumber.js
        const newValue = new BigNumber(commonPoolResult.toString())
        if (!cancelled) {
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

    timeoutId = setTimeout(pollCommonPool, INITIAL_TIMER)

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [commonPool, timeout, token, vaultContract])

  return commonPool
}

export function useTokenBalances(account, token, timeout = 5000) {
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

    timeoutId = setTimeout(pollAccountBalance, INITIAL_TIMER)

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [account, balances, timeout, tokenContract, token])

  return balances
}
