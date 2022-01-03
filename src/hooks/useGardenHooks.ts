import { TokenType } from './constants'
import { useContractReadOnly } from './useContract'
import { useConfigSubscription } from './useSubscriptions'
import connectAgreement from '@1hive/connect-agreement'
import connectGarden, { Garden } from '@1hive/connect-gardens'
import {
  createAppHook,
  useApps,
  useOrganization,
  usePermissions,
} from '@1hive/connect-react'
// utils
import env from '@/environment'
import { getAgreementConnectorConfig, getNetwork } from '@/networks'
import fundsManagerAbi from '@abis/FundsManager.json'
// abis
import minimeTokenAbi from '@abis/minimeToken.json'
import BigNumber from '@lib/bigNumber'
import { useConnectedGarden } from '@providers/ConnectedGarden'
import { getAppByName } from '@utils/data-utils'
import { addressesEqual } from '@utils/web3-utils'
import { useEffect, useMemo, useState } from 'react'

const INITIAL_TIMER = 2000

export function useGardenData() {
  const [connector, setConnector] = useState<Garden | null>(null)
  const [organization, orgStatus] = useOrganization()
  const [apps, appsStatus] = useApps()

  const { chainId } = useConnectedGarden()
  const { subgraphs } = getNetwork(chainId)

  const useAgreementHook = createAppHook(
    connectAgreement,
    getAgreementConnectorConfig(chainId).agreement
  )

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

    const fetchGardenConnector = () => {
      try {
        const gardenConnector: Garden = connectGarden(organization, {
          subgraphUrl: subgraphs.gardens,
        })

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
  }, [organization, subgraphs.gardens])

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

export function useCommonPool(
  fundsManagerAddress: string,
  token: TokenType,
  timeout = 8000
) {
  const [commonPool, setCommonPool] = useState(new BigNumber(-1))

  const { chainId } = useConnectedGarden()
  const fundsManagerContract = useContractReadOnly(
    fundsManagerAddress,
    fundsManagerAbi,
    chainId
  )

  useEffect(() => {
    let cancelled = false
    let timeoutId: number

    if (!fundsManagerContract || !token?.id) {
      return
    }

    const pollCommonPool = async () => {
      try {
        const commonPoolResult = await fundsManagerContract.balance(token.id)
        // Contract value is bn.js so we need to convert it to bignumber.js
        const newValue = new BigNumber(commonPoolResult.toString())
        if (!cancelled) {
          if (!newValue.eq(commonPool)) {
            setCommonPool(newValue)
          }
        }
      } catch (err) {
        console.error(`Error fetching common pool balance: ${err} retrying...`)
      }

      if (!cancelled) {
        timeoutId = window.setTimeout(pollCommonPool, timeout)
      }
    }

    timeoutId = window.setTimeout(pollCommonPool, INITIAL_TIMER)

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [commonPool, fundsManagerContract, timeout, token])

  return commonPool
}

export function useTokenBalances(
  account: string,
  token: TokenType,
  timeout = 5000
) {
  const [balances, setBalances] = useState({
    balance: new BigNumber(-1),
    totalSupply: new BigNumber(-1),
  })

  const { chainId } = useConnectedGarden()
  const tokenContract = useContractReadOnly(token?.id, minimeTokenAbi, chainId)

  useEffect(() => {
    if (!token?.id || !tokenContract) {
      return
    }

    let cancelled = false
    let timeoutId: number

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
        timeoutId = window.setTimeout(pollAccountBalance, timeout)
      }
    }

    timeoutId = window.setTimeout(pollAccountBalance, INITIAL_TIMER)

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [account, balances, timeout, tokenContract, token])

  return balances
}
