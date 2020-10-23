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
  const { alpha } = useAppState()

  const convictionHistory = getConvictionHistory(
    proposal.stakesHistory,
    latestBlock.number + 25 * TIME_UNIT,
    alpha,
    TIME_UNIT
  )

  const userConvictionHistory = account
    ? getConvictionHistoryByEntity(
        proposal.stakesHistory,
        account,
        latestBlock.number + 25 * TIME_UNIT,
        alpha,
        TIME_UNIT
      )
    : []

  return [convictionHistory, userConvictionHistory]
}
