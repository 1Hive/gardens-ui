import { useAppState } from '../providers/AppState'
import { useBlockTime } from './useBlock'

export default function useVoteGracePeriod() {
  const {
    config: { voting },
  } = useAppState()
  const blockTime = useBlockTime()
  const { bufferBlocks, executionDelayBlocks } = voting
  const gracePeriodBlocks = bufferBlocks / 2 + executionDelayBlocks
  return gracePeriodBlocks * blockTime
}
