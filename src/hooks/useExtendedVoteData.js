import { useMemo } from 'react'

import { useBlockTimeStamp } from './useBlock'
import { useContractReadOnly } from './useContract'
import { useAppState } from '../providers/AppState'
import useActions from './useActions'
import usePromise from './usePromise'
import { useWallet } from '../providers/Wallet'

import { getUserBalanceAt, getUserBalanceNow } from '../lib/token-utils'
import minimeTokenAbi from '../abi/minimeToken.json'

export default function useExtendedVoteData(vote) {
  const { account: connectedAccount } = useWallet()
  const { config } = useAppState()
  const { dandelionActions } = useActions()
  const { stakeToken } = config?.conviction || {}

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

  const userBalance = usePromise(userBalancePromise, [], -1)

  const canExecutePromise = useMemo(
    () => dandelionActions.canExecuteDecision(vote.id),
    [dandelionActions, vote.id]
  )
  const canExecute = usePromise(canExecutePromise, [], false)

  const canUserVotePromise = useMemo(
    () => dandelionActions.canUserVote(vote.id),
    [dandelionActions, vote.id]
  )
  const canUserVote = usePromise(canUserVotePromise, [], false)

  const userBalanceNowPromise = useMemo(
    () =>
      getUserBalanceNow(connectedAccount, tokenContract, stakeToken.decimals),
    [connectedAccount, tokenContract, stakeToken.decimals]
  )
  const userBalanceNow = usePromise(userBalanceNowPromise, [], -1)

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
