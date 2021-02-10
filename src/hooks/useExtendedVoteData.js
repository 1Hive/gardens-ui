import { useMemo } from 'react'

import { useBlockTimeStamp } from './useBlock'
import { useContractReadOnly } from './useContract'
import { useAppState } from '../providers/AppState'
import usePromise from './usePromise'
import { useWallet } from '../providers/Wallet'

import { getCanUserVote } from '../utils/vote-utils'
import { getUserBalanceAt, getUserBalanceNow } from '../utils/token-utils'
import minimeTokenAbi from '../abi/minimeToken.json'
import votingAbi from '../abi/voting.json'

export default function useExtendedVoteData(vote) {
  const { account: connectedAccount } = useWallet()
  const { config } = useAppState()
  const { stakeToken } = config.conviction
  const { id: votingAddress } = config.voting

  const votingContract = useContractReadOnly(votingAddress, votingAbi)

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
    if (!votingContract) {
      return
    }
    return votingContract.canExecute(vote.id)
  }, [votingContract, vote])

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
  const { id: votingAddress } = config?.voting || {}

  const votingContract = useContractReadOnly(votingAddress, votingAbi)

  const canUserVotePromise = useMemo(() => {
    return getCanUserVote(votingContract, vote.id, connectedAccount)
  }, [connectedAccount, votingContract, vote])

  const canUserVote = usePromise(canUserVotePromise, [], false, 3)

  return { canUserVote, canUserVotePromise }
}
