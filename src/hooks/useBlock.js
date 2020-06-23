import { useCallback, useState } from 'react'

import useInterval from './useInterval'
import { useWallet } from '../providers/Wallet'

export function useLatestBlock(updateEvery = 1000) {
  const { ethers } = useWallet()
  const [block, setBlock] = useState({ number: 0, timeStamp: 0 })

  const fetchBlock = useCallback(async () => {
    const { number, timestamp } = ethers
      ? await ethers.getBlock('latest')
      : block
    // Prevent unnecessary re-renders
    if (number !== block.number) setBlock({ number, timestamp })
  }, [block, ethers])

  useInterval(fetchBlock, updateEvery, true)

  return block
}
