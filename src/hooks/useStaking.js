import { useEffect, useState } from 'react'
import { useMounted } from './useMounted'
import { useWallet } from '../providers/Wallet'

import { useAppState } from '../providers/AppState'
import BigNumber from '../lib/bigNumber'

export function useStaking() {
  const mounted = useMounted()
  const { account } = useWallet()
  const { connectedAgreementApp } = useAppState()
  const [stakeManagement, setStakeManagement] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getStakingInformation() {
      const defaultValues = {
        available: new BigNumber('0'),
        challenged: new BigNumber('0'),
        locked: new BigNumber('0'),
        tokenDecimals: 1,
        total: new BigNumber('0'),
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
            allTokens[1].id,
            account
          )
          const stakingMovements = await connectedAgreementApp.stakingMovements(
            allTokens[1].id,
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
