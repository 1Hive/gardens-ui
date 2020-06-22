import { useMemo } from 'react'
import { useLatestBlock } from './useBlock'
import {
  getConvictionHistory,
  getConvictionHistoryByEntity,
} from '../lib/conviction'
import { useWallet } from '../providers/Wallet'
import { useAppState } from '../providers/AppState'

const TIME_UNIT = (60 * 60 * 24) / 15

export function useConvictionHistory(proposal) {
  const { account } = useWallet()
  const latestBlock = useLatestBlock()
  const { convictionStakes, alpha } = useAppState()

  const stakes = useMemo(() => {
    if (!convictionStakes || !proposal) {
      return []
    }
    return convictionStakes.filter(
      stake => stake.proposal === parseInt(proposal.id)
    )
  }, [convictionStakes, proposal])

  const convictionHistory = getConvictionHistory(
    stakes,
    latestBlock.number + 25 * TIME_UNIT,
    alpha,
    TIME_UNIT
  )

  const userConvictionHistory = account
    ? getConvictionHistoryByEntity(
        stakes,
        account,
        latestBlock.number + 25 * TIME_UNIT,
        alpha,
        TIME_UNIT
      )
    : []

  return [convictionHistory, userConvictionHistory]
}
