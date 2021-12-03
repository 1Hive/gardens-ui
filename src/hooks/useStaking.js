import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { noop } from '@1hive/1hive-ui'

import { useConnectedGarden } from '@providers/ConnectedGarden'
import { useContractReadOnly } from './useContract'
import { useGardenState } from '@providers/GardenState'
import { useMounted } from './useMounted'
import { useWallet } from '@providers/Wallet'

import actions from '../actions/garden-action-types'
import BigNumber from '@lib/bigNumber'
import { encodeFunctionData } from '@utils/web3-utils'
import radspec from '../radspec'

import stakingFactoryAbi from '@abis/StakingFactory.json'
import stakingAbi from '@abis/Staking.json'
import minimeTokenAbi from '@abis/minimeToken.json'

const MAX_INT = new BigNumber(2).pow(256).minus(1)
const STAKE_GAS_LIMIT = 500000

export function useStaking() {
  const mounted = useMounted()
  const { account } = useWallet()
  const { chainId } = useConnectedGarden()
  const { connectedAgreementApp } = useGardenState()

  const [stakeManagement, setStakeManagement] = useState(null)
  const [loading, setLoading] = useState(true)
  const [
    loadingStakingDataFromContract,
    setLoadingStakingDataFromContract,
  ] = useState(true)
  const [reFetchTotalBalance, setReFetchTotalBalance] = useState(false)

  const stakingMovementsSubscription = useRef(null)

  const stakingFactoryContract = useContractReadOnly(
    stakeManagement?.stakingFactory,
    stakingFactoryAbi,
    chainId
  )

  const stakingContract = useContractReadOnly(
    stakeManagement?.stakingInstance,
    stakingAbi,
    chainId
  )

  const tokenContract = useContractReadOnly(
    stakeManagement?.token?.id,
    minimeTokenAbi,
    chainId
  )

  const handleReFetchTotalBalance = useCallback(() => {
    setReFetchTotalBalance(true)
  }, [])

  const handleStakingMovementsData = useCallback(
    (error, data = []) => {
      if (error || !data) {
        return
      }
      if (mounted()) {
        setStakeManagement(stakeManagement => ({
          ...stakeManagement,
          stakingMovements: data,
        }))
      }
    },
    [mounted]
  )

  useEffect(() => {
    setLoadingStakingDataFromContract(true)
    setLoading(true)
  }, [account])

  useEffect(() => {
    async function getStakingInformation() {
      const defaultValues = {
        allowance: new BigNumber('0'),
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

          stakingMovementsSubscription.current = await connectedAgreementApp.onStakingMovements(
            allTokens[1].id,
            account,
            {},
            handleStakingMovementsData
          )

          const accountBalance = await tokenContract?.balanceOf(account)

          if (mounted()) {
            setStakeManagement(stakeManagement => ({
              ...stakeManagement,
              token: allTokens[1],
              accountBalance,
              staking: staking
                ? {
                    ...staking,
                    available: new BigNumber(staking.available),
                    challenged: new BigNumber(staking.challenged),
                    locked: new BigNumber(staking.locked),
                    total: new BigNumber(staking.total),
                  }
                : defaultValues,
              stakingFactory: stakingFactory,
              stakingInstance: null,
            }))
          }
        } else {
          setStakeManagement(null)
        }
      } catch (err) {
        setStakeManagement({
          staking: defaultValues,
          stakingMovements: null,
          stakingInstance: null,
        })
        console.error(err)
      }
      setLoading(false)
    }

    if (connectedAgreementApp && account) {
      getStakingInformation()
    }
    return () => stakingMovementsSubscription.current?.unsubscribe()
  }, [
    connectedAgreementApp,
    handleStakingMovementsData,
    mounted,
    account,
    tokenContract,
  ])

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
      const { staked, locked } = await stakingContract.getBalancesOf(account)
      const stakedBN = new BigNumber(staked.toString())
      const { allowance } = await stakingContract.getLock(
        account,
        connectedAgreementApp.address
      )

      const allowanceBN = new BigNumber(allowance.toString())
      const lockedBN = new BigNumber(locked.toString())
      const availableBN = stakedBN.minus(lockedBN)

      if (mounted()) {
        if (
          !stakedBN.eq(stakeManagement.staking.total) ||
          reFetchTotalBalance
        ) {
          setStakeManagement(stakeManagement => {
            return {
              ...stakeManagement,
              staking: {
                ...stakeManagement.staking,
                total: stakedBN,
                available: availableBN,
                locked: lockedBN,
                allowance: allowanceBN,
              },
            }
          })
          setReFetchTotalBalance(false)
        }
        if (!allowanceBN.eq(stakeManagement.staking.allowance)) {
          setStakeManagement(stakeManagement => {
            return {
              ...stakeManagement,
              staking: {
                ...stakeManagement.staking,
                allowance: allowanceBN,
              },
            }
          })
        }
      }

      setLoadingStakingDataFromContract(false)
    }
    if (
      account &&
      stakingContract &&
      stakeManagement &&
      connectedAgreementApp &&
      !loading
    ) {
      fetchStakingBalance()
    }
  }, [
    account,
    stakingContract,
    mounted,
    stakeManagement,
    reFetchTotalBalance,
    connectedAgreementApp,
    loading,
  ])

  const stake = useCallback(
    async ({ amount }, onDone = noop) => {
      if (!stakeManagement && stakingContract) {
        return
      }

      const stakeData = encodeFunctionData(stakingContract, 'stake', [
        amount.toString(10),
        '0x',
      ])

      const description = radspec[actions.ADD_FUNDS]()
      const type = actions.ADD_FUNDS

      const intent = [
        {
          data: stakeData,
          from: account,
          to: stakeManagement.stakingInstance,
          description,
          type,
          gasLimit: STAKE_GAS_LIMIT,
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

      const description = radspec[actions.WITHDRAW_FUNDS]()
      const type = actions.WITHDRAW_FUNDS

      const intent = [
        {
          data: stakeData,
          from: account,
          to: stakeManagement.stakingInstance,
          description,
          type,
          gasLimit: STAKE_GAS_LIMIT,
        },
      ]

      if (mounted()) {
        onDone(intent)
      }
    },
    [account, mounted, stakeManagement, stakingContract]
  )

  const approveTokenAmount = useCallback(
    async (amount, onDone = noop) => {
      if (!stakeManagement && tokenContract) {
        return
      }

      const approveData = encodeFunctionData(tokenContract, 'approve', [
        stakeManagement.stakingInstance,
        amount.toString(10),
      ])

      const description = radspec[actions.APPROVE_TOKEN]({
        tokenSymbol: stakeManagement.token.symbol,
      })
      const type = actions.APPROVE_TOKEN

      const intent = [
        {
          data: approveData,
          from: account,
          to: stakeManagement.token.id,
          description,
          type,
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

  const allowManager = useCallback(
    async onDone => {
      if (!stakingContract || !connectedAgreementApp || !stakeManagement) {
        return
      }

      if (onDone) {
        const allowManagerData = encodeFunctionData(
          stakingContract,
          'allowManager',
          [connectedAgreementApp.address, MAX_INT.toString(10), '0x']
        )

        const description = radspec[actions.ALLOW_MANAGER]()
        const type = actions.ALLOW_MANAGER

        const intent = [
          {
            data: allowManagerData,
            from: account,
            to: stakeManagement.stakingInstance,
            description,
            type,
          },
        ]
        if (mounted()) {
          onDone(intent)
        }
      } else {
        await stakingContract.allowManager(
          connectedAgreementApp.address,
          MAX_INT.toString(10),
          '0x'
        )
      }
    },
    [account, connectedAgreementApp, mounted, stakingContract, stakeManagement]
  )

  const unlockAndRemoveManager = useCallback(async () => {
    if (!stakingContract || !connectedAgreementApp || !stakeManagement) {
      return
    }

    await stakingContract.unlockAndRemoveManager(
      account,
      connectedAgreementApp.address
    )
  }, [account, connectedAgreementApp, stakingContract, stakeManagement])

  return useMemo(() => {
    return [
      stakeManagement,
      {
        allowManager: allowManager,
        unlockAndRemoveManager: unlockAndRemoveManager,
        stake: stake,
        withdraw: withdraw,
        approveTokenAmount: approveTokenAmount,
        getStakedAmount: getStakedAmount,
        reFetchTotalBalance: handleReFetchTotalBalance,
        getAllowance: getAllowance,
      },
      loading || loadingStakingDataFromContract,
    ]
  }, [
    allowManager,
    unlockAndRemoveManager,
    stake,
    withdraw,
    approveTokenAmount,
    getStakedAmount,
    handleReFetchTotalBalance,
    getAllowance,
    loading,
    loadingStakingDataFromContract,
    stakeManagement,
  ])
}
