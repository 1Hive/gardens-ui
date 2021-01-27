import { useCallback, useEffect, useState } from 'react'
import { useMounted } from './useMounted'
import { useWallet } from '../providers/Wallet'

import { useAppState } from '../providers/AppState'
import BigNumber from '../lib/bigNumber'
import { useContract, useContractReadOnly } from './useContract'

import stakingFactoryAbi from '../abi/StakingFactory.json'
import stakingAbi from '../abi/Staking.json'
import minimeTokenAbi from '../abi/minimeToken.json'

import { toDecimals } from '../utils/math-utils'

export function useStaking() {
  const mounted = useMounted()
  const { account } = useWallet()
  const { connectedAgreementApp } = useAppState()
  const [stakeManagement, setStakeManagement] = useState(null)
  const [loading, setLoading] = useState(true)

  const stakingFactoryContract = useContractReadOnly(
    stakeManagement && stakeManagement.stakingFactory,
    stakingFactoryAbi
  )

  const stakingContract = useContract(
    stakeManagement && stakeManagement.stakingInstance,
    stakingAbi
  )

  const tokenContract = useContract(
    stakeManagement && stakeManagement.token && stakeManagement.token.id,
    minimeTokenAbi
  )

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

          const stakingFactory = await connectedAgreementApp.stakingFactory()

          const allRequirements = await Promise.all(
            disputableApps.map(app => app.collateralRequirement())
          )
          const allTokens = await Promise.all(
            allRequirements.map(collateral => collateral.token())
          )

          console.log('all tokens ', allTokens)

          const dao = await connectedAgreementApp.stakingId(
            allTokens[1].id,
            account
          )

          console.log('DAO!!!!!! ', dao)

          const staking = await connectedAgreementApp.staking(
            allTokens[1].id,
            account
          )
          console.log('STAKING ', staking)

          let stakingMovements
          try {
            stakingMovements = await connectedAgreementApp.stakingMovements(
              allTokens[1].id,
              account
            )
          } catch (error) {
            console.log('error ', error)
          }

          console.log('staking movementssss ', stakingMovements)

          if (mounted()) {
            setStakeManagement({
              token: allTokens[1],
              staking: staking || defaultValues,
              stakingMovements: stakingMovements,
              stakingFactory: stakingFactory,
              stakingInstance: null,
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
          stakingInstance: null,
        })
        setLoading(false)
        console.error(err)
      }
    }

    if (connectedAgreementApp && account) {
      getStakingInformation()
    }
  }, [connectedAgreementApp, mounted, account])

  useEffect(() => {
    async function fetchStakingAddress() {
      const stakingInstanceAddress = await stakingFactoryContract.getInstance(
        stakeManagement.token.id
      )
      if (mounted()) {
        setStakeManagement(stakeManagement => {
          return {
            ...stakeManagement,
            stakingInstance: stakingInstanceAddress,
          }
        })
      }
    }
    if (
      stakingFactoryContract &&
      stakeManagement &&
      stakeManagement.stakingInstance === null
    ) {
      fetchStakingAddress()
    }
  }, [stakingFactoryContract, mounted, stakeManagement])

  const stake = useCallback(async () => {
    if (!stakeManagement && stakingContract) {
      return
    }
    const stakeAmount = new BigNumber(
      toDecimals('1', stakeManagement.token.decimals)
    ).toString(10)

    await tokenContract.approve(stakeManagement.stakingInstance, stakeAmount)
    await stakingContract.stake(stakeAmount, '0x')
  }, [stakeManagement, stakingContract, tokenContract])

  console.log('stakeManagement ', stakeManagement)

  return [
    stakeManagement,
    { stake: stake },
    loading || !stakeManagement.stakingInstanceAddress,
  ]
}
