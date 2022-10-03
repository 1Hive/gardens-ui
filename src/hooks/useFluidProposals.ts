import { useEffect, useState } from 'react'
import { useMounted } from './useMounted'

import { useConnectedGarden } from '@/providers/ConnectedGarden'
import { useContractReadOnly } from './useContract'

import fluidProposalsAbi from '@abis/FluidProposals.json'

export default function useFluidProposals(proposalId: number) {
  const [minStake, setMinStake] = useState(null)
  const [targetRate, setTargetRate] = useState(null)
  const [currentRate, setCurrentRate] = useState(null)
  const [loading, setLoading] = useState(false)

  const mounted = useMounted()

  const { chainId, fluidProposals } = useConnectedGarden()

  const fluidProposalsContract = useContractReadOnly(
    fluidProposals,
    fluidProposalsAbi,
    chainId
  )

  useEffect(() => {
    if (!fluidProposalsContract || !proposalId) {
      return
    }

    const fetchFluidProposalsData = async () => {
      try {
        setLoading(true)

        const minStake = await fluidProposalsContract.minStake()
        const targetRate = await fluidProposalsContract.getTargetRate(
          proposalId
        )
        const currentRate = await fluidProposalsContract.getCurrentRate(
          proposalId
        )

        if (mounted()) {
          setMinStake(minStake)
          setTargetRate(targetRate)
          setCurrentRate(currentRate)
          setLoading(false)
        }
      } catch (err) {
        setLoading(false)
        console.error(`Error fetching fluid proposals data: ${err}`)
      }
    }

    fetchFluidProposalsData()
  }, [fluidProposalsContract, proposalId])

  return [minStake, currentRate, targetRate, loading]
}
