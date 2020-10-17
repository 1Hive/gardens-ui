import { useMemo } from 'react'

import { useContractReadOnly } from './useContract'
import { useAppState } from '../providers/AppState'
import usePromise from './usePromise'
import { useWallet } from '../providers/Wallet'

import { getUserBalanceAt } from '../lib/token-utils'
import minimeTokenAbi from '../abi/minimeToken.json'

export default function useExtendedVoteData(vote) {
  const { account: connectedAccount } = useWallet()
  const { config } = useAppState()
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

  return { userBalance }
}
