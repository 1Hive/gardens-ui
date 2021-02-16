import { useCallback, useEffect, useState } from 'react'
import { noop } from '@1hive/1hive-ui'
import { useMounted } from './useMounted'
import { useWallet } from '../providers/Wallet'

import { useAppState } from '../providers/AppState'
import BigNumber from '../lib/bigNumber'
import { useContract, useContractReadOnly } from './useContract'

import { encodeFunctionData } from '../utils/web3-utils'

import stakingFactoryAbi from '../abi/StakingFactory.json'
import stakingAbi from '../abi/Staking.json'
import minimeTokenAbi from '../abi/minimeToken.json'

export function useStaking() {
  const mounted = useMounted()
  const { account } = useWallet()
  const { connectedAgreementApp } = useAppState()
  const [stakeManagement, setStakeManagement] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reFetchTotalBalance, setReFetchTotalBalance] = useState(false)

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

  const handleReFetchTotalBalance = useCallback(() => {
    setReFetchTotalBalance(true)
  }, [])

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
              token: allTokens[1],
              staking: staking
                ? {
                    ...staking,
                    available: new BigNumber(staking.available),
                    challenged: new BigNumber(staking.challenged),
                    locked: new BigNumber(staking.locked),
                    total: new BigNumber(staking.total),
                  }
                : defaultValues,
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

  useEffect(() => {
    async function fetchStakingBalance() {
      const { staked } = await stakingContract.getBalancesOf(account)
      const stakedBN = new BigNumber(staked.toString())

      if (!stakeManagement.staking.total.eq(stakedBN) || reFetchTotalBalance) {
        if (mounted()) {
          setStakeManagement(stakeManagement => {
            return {
              ...stakeManagement,
              staking: {
                ...stakeManagement.staking,
                total: stakedBN,
                available: stakedBN,
              },
            }
          })
          setReFetchTotalBalance(false)
        }
      }
    }
    if (stakingContract && stakeManagement) {
      fetchStakingBalance()
    }
  }, [account, stakingContract, mounted, stakeManagement, reFetchTotalBalance])

  const stake = useCallback(
    async ({ amount }, onDone = noop) => {
      if (!stakeManagement && stakingContract) {
        return
      }

      const stakeData = encodeFunctionData(stakingContract, 'stake', [
        amount.toString(10),
        '0x',
      ])

      const intent = [
        {
          data: stakeData,
          from: account,
          to: stakeManagement.stakingInstance,
          description: 'Stake HNY',
        },
      ]

      if (mounted()) {
        onDone(intent)
      }
    },
    [account, mounted, stakeManagement, stakingContract]
  )

  const withdraw = useCallback(
    async ({ amount }, onDone = noop) => {
      if (!stakeManagement && stakingContract && amount) {
        return
      }

      const stakeData = encodeFunctionData(stakingContract, 'unstake', [
        amount.toString(10),
        '0x',
      ])

      const intent = [
        {
          data: stakeData,
          from: account,
          to: stakeManagement.stakingInstance,
          description: 'Withdraw HNY',
        },
      ]

      if (mounted()) {
        onDone(intent)
      }
    },
    [account, mounted, stakeManagement, stakingContract]
  )

  const approveTokenAmount = useCallback(
    async ({ amount }, onDone = noop) => {
      if (!stakeManagement && tokenContract) {
        return
      }

      const approveData = encodeFunctionData(tokenContract, 'approve', [
        stakeManagement.stakingInstance,
        amount.toString(10),
      ])

      const intent = [
        {
          data: approveData,
          from: account,
          to: stakeManagement.token.id,
          description: 'Approve HNY',
        },
      ]

      if (mounted()) {
        onDone(intent)
      }
    },
    [account, mounted, stakeManagement, tokenContract]
  )

  const getAllowance = useCallback(async () => {
    if (!tokenContract) {
      return
    }

    const allowance = await tokenContract.allowance(
      account,
      stakeManagement.stakingInstance
    )

    return new BigNumber(allowance.toString())
  }, [account, tokenContract, stakeManagement])

  const getStakedAmount = useCallback(async () => {
    if (!stakingContract) {
      return
    }

    const { staked } = await stakingContract.getBalancesOf(account)
    return staked
  }, [stakingContract, account])

  return [
    stakeManagement,
    {
      stake: stake,
      withdraw: withdraw,
      approveTokenAmount: approveTokenAmount,
      getStakedAmount: getStakedAmount,
      reFetchTotalBalance: handleReFetchTotalBalance,
      getAllowance: getAllowance,
    },
    loading || !stakeManagement.stakingInstanceAddress,
  ]
}
