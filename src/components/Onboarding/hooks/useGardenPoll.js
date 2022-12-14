import { useEffect } from 'react'
import { getGarden } from '@1hive/connect-gardens'
import { getNetwork } from '@/networks'

const noop = () => {}

// Onboarding local hook to poll for the new created garden
export default function useGardenPoll(gardenAddress, chainId, onResult = noop) {
  const { subgraphs } = getNetwork(chainId)

  // Poll garden until we can confirm it was picked up by the subgraph.
  useEffect(() => {
    let timer

    const pollGarden = async () => {
      try {
        const arrNetworks = env('NETWORK_HAS_FLUID_PROPOSAL')

        // Note that getGarden throws an error if it can't find the garden for the given address
        await getGarden(
          {
            network: chainId,
            subgraphUrl: subgraphs.gardens,
            hasFluidProposal: arrNetworks.includes('' + chainId),
          },
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
  }, [chainId, gardenAddress, onResult, subgraphs])
}
