import { useMemo } from 'react'

import { useBlockTimeStamp } from './useBlock'
import { useContractReadOnly } from './useContract'
import { useAppState } from '../providers/AppState'
import usePromise from './usePromise'
import { useWallet } from '../providers/Wallet'

import { getCanUserVote } from '../utils/vote-utils'
import { getUserBalanceAt, getUserBalanceNow } from '../utils/token-utils'
import minimeTokenAbi from '../abi/minimeToken.json'
import dandelionVotingAbi from '../abi/DandelionVoting.json'

export default function useExtendedVoteData(vote) {
  const { account: connectedAccount } = useWallet()
  const { config } = useAppState()
  const { stakeToken } = config.conviction
  const { id: dandelionVotingAddress } = config.voting

  const dandelionVotingContract = useContractReadOnly(
    dandelionVotingAddress,
    dandelionVotingAbi
  )

  const tokenContract = useContractReadOnly(stakeToken.id, minimeTokenAbi)

  const userBalancePromise = useMemo(() => {
    if (!vote?.id) {
      return -1
    }
    return getUserBalanceAt(
      connectedAccount,
      vote.snapshotBlock,
      tokenContract,
      stakeToken.decimals
    )
  }, [
    connectedAccount,
    tokenContract,
    stakeToken.decimals,
    vote.id,
    vote.snapshotBlock,
  ])

  const userBalance = usePromise(userBalancePromise, [], -1, 1)

  const canExecutePromise = useMemo(() => {
    if (!dandelionVotingContract) {
      return
    }
    return dandelionVotingContract.canExecute(vote.id)
  }, [dandelionVotingContract, vote])

  const canExecute = usePromise(canExecutePromise, [], false, 2)

  const { canUserVote, canUserVotePromise } = useCanUserVote(vote)

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

export function useCanUserVote(vote) {
  const { config } = useAppState()
  const { account: connectedAccount } = useWallet()
  const { id: dandelionVotingAddress } = config?.voting || {}

  const dandelionVotingContract = useContractReadOnly(
    dandelionVotingAddress,
    dandelionVotingAbi
  )

  const canUserVotePromise = useMemo(() => {
    return getCanUserVote(dandelionVotingContract, vote.id, connectedAccount)
  }, [connectedAccount, dandelionVotingContract, vote])

  const canUserVote = usePromise(canUserVotePromise, [], false, 3)

  return { canUserVote, canUserVotePromise }
}
