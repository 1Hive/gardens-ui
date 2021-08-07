import { useEffect, useMemo, useRef, useState } from 'react'

import { useMounted } from '@hooks/useMounted'
import { useWallet } from '@providers/Wallet'
import { getNetwork } from '../networks'

const NETWORK_TIMES = new Map([
  ['main', 13],
  ['kovan', 4],
  ['rinkeby', 14],
  ['ropsten', 11],
  ['goerli', 15],
  ['xdai', 5],
])

export function useLatestBlock() {
  const mounted = useMounted()
  const { ethers } = useWallet()
  const [block, setBlock] = useState({ number: 0, timestamp: 0 })

  const blockTime = useBlockTime()
  const blockNumberRef = useRef(block.number)

  useEffect(() => {
    let timeoutId

    const pollBlock = async () => {
      try {
        const { number, timestamp } = await ethers.getBlock('latest')

        if (number !== blockNumberRef.current) {
          setBlock({ number, timestamp })
        }
      } catch (err) {
        console.error('Error fetching block', err)
      }

      if (mounted()) {
        timeoutId = setTimeout(pollBlock, blockTime * 1000)
      }
    }

    pollBlock()

    return () => {
      clearTimeout(timeoutId)
    }
  }, [blockTime, ethers, mounted])

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
