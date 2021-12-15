import { useEffect, useMemo, useRef, useState } from 'react'

import { useMounted } from '@hooks/useMounted'
import { getDefaultProvider } from '@utils/web3-utils'
import { getNetwork } from '../networks'

const NETWORK_TIMES = new Map([
  ['main', 13],
  ['kovan', 4],
  ['rinkeby', 14],
  ['ropsten', 11],
  ['goerli', 15],
  ['xdai', 5],
])

function useProvider(chainId) {
  return useMemo(() => getDefaultProvider(chainId), [chainId])
}

export function useLatestBlock(chainId) {
  const mounted = useMounted()
  const [block, setBlock] = useState({ number: 0, timestamp: 0 })

  const blockTime = useBlockTime(chainId)
  const blockNumberRef = useRef(block.number)
  const provider = useProvider(chainId)

  useEffect(() => {
    let timeoutId

    const pollBlock = async () => {
      try {
        const { number, timestamp } = await provider.getBlock('latest')

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
  }, [blockTime, provider, mounted])

  return block
}

export function useBlockTimeStamp(blockNumber, chainId) {
  const [timestamp, setTimestamp] = useState(0)
  const provider = useProvider(chainId)

  useEffect(() => {
    let cancelled = false
    const fetchBlock = async () => {
      const block = await provider.getBlock(blockNumber)

      if (block && !cancelled) {
        setTimestamp(block.timestamp * 1000)
      }
    }

    fetchBlock()

    return () => {
      cancelled = true
    }
  }, [blockNumber, provider])

  return timestamp
}

export function useBlockTime(chainId) {
  const network = getNetwork(chainId)

  return useMemo(() => (network ? NETWORK_TIMES.get(network.type) : null), [
    network,
  ])
}
