import { useMemo } from 'react'

import { useBlockTimeStamp } from './useBlock'
import { useContractReadOnly } from './useContract'
import { useAppState } from '../providers/AppState'
import usePromise from './usePromise'
import { useWallet } from '../providers/Wallet'

import { getAppAddressByName } from '../lib/data-utils'
import { getUserBalanceAt, getUserBalanceNow } from '../lib/token-utils'
import minimeTokenAbi from '../abi/minimeToken.json'
import dandelionVotingAbi from '../abi/DandelionVoting.json'

export default function useExtendedVoteData(vote) {
  const { account: connectedAccount } = useWallet()
  const { config, installedApps } = useAppState()
  const { stakeToken } = config?.conviction || {}

  const dandelionVotingAddress = getAppAddressByName(
    installedApps,
    'dandelion-voting'
  )
  const dandelionVotingContract = useContractReadOnly(
    dandelionVotingAddress,
    dandelionVotingAbi.abi
  )

  const tokenContract = useContractReadOnly(stakeToken?.id, minimeTokenAbi)

  const userBalancePromise = useMemo(() => {
    if (!vote) {
      return -1
    }
    return getUserBalanceAt(
      connectedAccount,
      vote.snapshotBlock,
      tokenContract,
      stakeToken.decimals
    )
  }, [connectedAccount, tokenContract, stakeToken.decimals, vote])

  const userBalance = usePromise(userBalancePromise, [], -1, 1)

  const canExecutePromise = useMemo(() => {
    if (!dandelionVotingContract) {
      return
    }
    return dandelionVotingContract.canExecute(vote.id)
  }, [dandelionVotingContract, vote.id])

  const canExecute = usePromise(canExecutePromise, [], false, 2)

  const canUserVotePromise = useMemo(() => {
    if (!dandelionVotingContract) {
      return
    }
    return dandelionVotingContract.canVote(vote.id, connectedAccount)
  }, [connectedAccount, dandelionVotingContract, vote.id])

  const canUserVote = usePromise(canUserVotePromise, [], false, 3)

  const userBalanceNowPromise = useMemo(
    () =>
      getUserBalanceNow(connectedAccount, tokenContract, stakeToken.decimals),
    [connectedAccount, tokenContract, stakeToken.decimals]
  )
  const userBalanceNow = usePromise(userBalanceNowPromise, [], -1, 4)

  const startTimestamp = useBlockTimeStamp(vote.startBlock)

  return {
    canExecute,
    canExecutePromise,
    canUserVote,
    canUserVotePromise,
    userBalance,
    userBalancePromise,
    userBalanceNow,
    userBalanceNowPromise,
    startTimestamp,
  }
}
