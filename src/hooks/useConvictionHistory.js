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
  const { stakesHistory, alpha } = useAppState()

  const stakes = useMemo(() => {
    if (!stakesHistory || !proposal) {
      return []
    }
    return stakesHistory.filter(
      stake => parseInt(stake.proposalId) === parseInt(proposal.id)
    )
  }, [stakesHistory, proposal])

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
