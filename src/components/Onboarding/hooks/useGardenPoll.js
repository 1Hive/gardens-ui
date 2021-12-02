import { useEffect } from 'react'
import { useWallet } from '@providers/Wallet'
import { getGarden } from '@1hive/connect-gardens'
import { getNetwork } from '@/networks'

const noop = () => {}

// Onboarding local hook to poll for the new created garden
export default function useGardenPoll(gardenAddress, onResult = noop) {
  const { preferredChain } = useWallet()
  const { subgraphs } = getNetwork(preferredChain)

  // Poll garden until we can confirm it was picked up by the subgraph.
  useEffect(() => {
    let timer

    const pollGarden = async () => {
      try {
        // Note that getGarden throws an error if it can't find the garden for the given address
        await getGarden(
          { network: preferredChain, subgraphUrl: subgraphs.gardens },
          gardenAddress
        )

        onResult()
      } catch (err) {
        console.error(err)
        timer = setTimeout(pollGarden, 2500)
      }
    }

    if (gardenAddress) {
      pollGarden()
    }

    return () => clearTimeout(timer)
  }, [gardenAddress, onResult, preferredChain, subgraphs])
}
