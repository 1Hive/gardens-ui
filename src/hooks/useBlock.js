import { useCallback, useState } from 'react'

import useInterval from './useInterval'
import { useWallet } from '../providers/Wallet'

export function useLatestBlock(updateEvery = 1000) {
  const { getBlockNumber } = useWallet()
  const [block, setBlock] = useState({ number: 0, timeStamp: 0 })

  const fetchBlock = useCallback(async () => {
    const { number, timestamp } = getBlockNumber() || block
    // Prevent unnecessary re-renders
    if (number !== block.number) setBlock({ number, timestamp })
  }, [block, getBlockNumber])

  useInterval(fetchBlock, updateEvery, true)

  return block
}
