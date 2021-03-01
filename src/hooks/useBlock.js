import { useCallback, useEffect, useMemo, useState } from 'react'

import useInterval from './useInterval'
import { useWallet } from '../providers/Wallet'
import { getNetwork } from '../networks'

const NETWORK_TIMES = new Map([
  ['main', 13],
  ['kovan', 4],
  ['rinkeby', 14],
  ['ropsten', 11],
  ['goerli', 15],
  ['xdai', 5],
])

export function useLatestBlock(updateEvery = 1000) {
  const { ethers } = useWallet()
  const [block, setBlock] = useState({ number: 0, timestamp: 0 })

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

export function useBlockTimeStamp(blockNumber) {
  const { ethers } = useWallet()
  const [timestamp, setTimestamp] = useState(0)

  useEffect(() => {
    let cancelled = false
    const fetchBlock = async () => {
      const block = await ethers.getBlock(blockNumber)

      if (block && !cancelled) {
        setTimestamp(block.timestamp * 1000)
      }
    }

    fetchBlock()

    return () => {
      cancelled = true
    }
  }, [blockNumber, ethers])

  return timestamp
}

export function useBlockTime() {
  const network = getNetwork()

  return useMemo(() => (network ? NETWORK_TIMES.get(network.type) : null), [
    network,
  ])
}
