import { useEffect, useState } from 'react'
import { useConnectedGarden } from '@/providers/ConnectedGarden'
import { useContractReadOnly } from './useContract'
import { useMounted } from './useMounted'

import fluidProposalsAbi from '@abis/FluidProposals.json'
import superfluidAbi from '@abis/superfluid.json'
import cfaAbi from '@abis/CFAv1.json'
import { ethers } from 'ethers'
import { getFlowAmountByPerSecondFlowRate } from '@/utils/stream-utils'

export default function useSuperfluidCFAv1(beneficiary: string) {
  const [flowRate, setFlowRate] = useState('')
  const [superfluidAragonApp, setSuperfluidAragonApp] = useState('')
  const [cfa, setCfa] = useState('')
  const [loading, setLoading] = useState(true)
  const { chainId, fluidProposals } = useConnectedGarden()

  const flowRateMonthly = getFlowAmountByPerSecondFlowRate(
    flowRate.toString()
  ).monthly

  const fluidProposalsContract = useContractReadOnly(
    fluidProposals,
    fluidProposalsAbi,
    chainId
  )

  const superfluidAragonAppContract = useContractReadOnly(
    superfluidAragonApp,
    superfluidAbi,
    chainId
  )

  const cfaContract = useContractReadOnly(cfa, cfaAbi, chainId)

  const mounted = useMounted()

  useEffect(() => {
    if (!fluidProposalsContract) {
      setLoading(false)
      return
    }

    const fetchFlowRate = async () => {
      try {
        setSuperfluidAragonApp(await fluidProposalsContract.superfluid())

        if (!superfluidAragonAppContract) {
          setLoading(false)
          return
        }

        setCfa(await superfluidAragonAppContract.cfa())

        if (!cfaContract) {
          setLoading(false)
          return
        }

        const token = await fluidProposalsContract.token()
        const sender = await superfluidAragonAppContract.agent()

        const flow = await cfaContract.getFlow(
          ethers.utils.getAddress(token),
          ethers.utils.getAddress(sender),
          ethers.utils.getAddress(beneficiary)
        )

        console.log(flow)

        if (mounted()) {
          setFlowRate(flow.flowRate)
        }
      } catch (err) {
        console.error(`Error fetching signal proposal type ${err}`)
      }
      setLoading(false)
    }

    fetchFlowRate()
  }, [mounted, fluidProposalsContract, beneficiary])

  return { flowRateMonthly, loading }
}
