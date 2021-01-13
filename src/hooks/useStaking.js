import { useEffect, useState } from 'react'
import { useMounted } from './useMounted'
import { useWallet } from '../providers/Wallet'

import { useAppState } from '../providers/AppState'
import { getAppByName } from '../utils/data-utils'
import env from '../environment'

export function useStaking() {
  const mounted = useMounted()
  const { account } = useWallet()
  const { installedApps: apps } = useAppState()
  const connectedAgreementApp = getAppByName(apps, env('AGREEMENT_APP_NAME'))
  const [stakeManagement, setStakeManagement] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getStakingInformation() {
      const defaultValues = {
        available: '0',
        challenged: '0',
        locked: '0',
        tokenDecimals: 1,
        total: '0',
      }
      try {
        if (account) {
          const disputableApps = await connectedAgreementApp.disputableApps()
          const allRequirements = await Promise.all(
            disputableApps.map(app => app.collateralRequirement())
          )
          const allTokens = await Promise.all(
            allRequirements.map(collateral => collateral.token())
          )

          const staking = await connectedAgreementApp.staking(
            allTokens[0].id,
            account
          )
          const stakingMovements = await connectedAgreementApp.stakingMovements(
            allTokens[0].id,
            account
          )

          if (mounted()) {
            setStakeManagement({
              token: allTokens[0],
              staking: staking || defaultValues,
              stakingMovements: stakingMovements,
            })

            setLoading(false)
          }
        } else {
          setStakeManagement(null)
          setLoading(false)
        }
      } catch (err) {
        setStakeManagement({
          staking: defaultValues,
          stakingMovements: null,
        })
        setLoading(false)
        console.error(err)
      }
    }

    if (connectedAgreementApp && account) {
      getStakingInformation()
    }
  }, [connectedAgreementApp, mounted, account])

  return [stakeManagement, loading]
}
