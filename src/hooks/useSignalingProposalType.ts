import { useEffect, useState } from 'react'
import { useConnectedGarden } from '@/providers/ConnectedGarden'
import { useContractReadOnly } from './useContract'
import { useMounted } from './useMounted'

import fluidProposalsAbi from '@abis/FluidProposals.json'
import superfluidAbi from '@abis/superfluid.json'
import cfaAbi from '@abis/CFAv1.json'
import { ethers } from 'ethers'
import {
  getFlowAmountByPerSecondFlowRate,
  generateSuperfluidLink,
} from '@/utils/stream-utils'

const FLOW_INITIAL_STATE = {
  superfluidAragonApp: '',
  cfa: '',
  flowRateConvertions: {
    daily: '',
    weekly: '',
    monthly: '',
    yearly: '',
  },
  superfluidLink: '',
}

export default function useSuperfluidCFAv1(beneficiary: string) {
  const [flow, setFlow] = useState(FLOW_INITIAL_STATE)
  const mounted = useMounted()
  const [loading, setLoading] = useState(true)
  const { chainId, fluidProposals } = useConnectedGarden()

  const fluidProposalsContract = useContractReadOnly(
    fluidProposals,
    fluidProposalsAbi,
    chainId
  )

  const superfluidAragonAppContract = useContractReadOnly(
    flow?.superfluidAragonApp,
    superfluidAbi,
    chainId
  )

  const cfaContract = useContractReadOnly(flow?.cfa, cfaAbi, chainId)

  useEffect(() => {
    setLoading(true)
  }, [beneficiary])

  useEffect(() => {
    const fetchFlowRate = async () => {
      try {
        const token = await fluidProposalsContract?.token()
        const sender = await superfluidAragonAppContract?.agent()

        const flowData = await cfaContract?.getFlow(
          ethers.utils.getAddress(token),
          ethers.utils.getAddress(sender),
          ethers.utils.getAddress(beneficiary)
        )

        if (mounted()) {
          setFlow((flow) => ({
            ...flow,
            flowRateConvertions: getFlowAmountByPerSecondFlowRate(
              flowData.flowRate.toString()
            ),
            superfluidLink: generateSuperfluidLink(token, beneficiary, chainId),
          }))
        }
      } catch (err) {
        setFlow(FLOW_INITIAL_STATE)
        console.error(`Error fetching flow ${err}`)
      }
      setLoading(false)
    }
    if (
      fluidProposalsContract &&
      superfluidAragonAppContract &&
      cfaContract &&
      flow
    ) {
      fetchFlowRate()
    }
  }, [
    mounted,
    fluidProposalsContract,
    superfluidAragonAppContract,
    cfaContract,
    flow,
    beneficiary,
  ])

  useEffect(() => {
    async function fetchSuperFluidAragonAppAddress() {
      const superfluidAragonAppAddress =
        await fluidProposalsContract?.superfluid()
      if (mounted()) {
        setFlow((flow) => {
          return {
            ...flow,
            superfluidAragonApp: superfluidAragonAppAddress,
          }
        })
      }
    }
    if (fluidProposalsContract && flow && flow.superfluidAragonApp === '') {
      fetchSuperFluidAragonAppAddress()
    }
  }, [fluidProposalsContract, mounted, flow])

  useEffect(() => {
    async function fetchCfaAddress() {
      const cfaAddress = await superfluidAragonAppContract?.cfa()
      if (mounted()) {
        setFlow((flow) => {
          return {
            ...flow,
            cfa: cfaAddress,
          }
        })
      }
    }
    if (superfluidAragonAppContract && flow && flow.cfa === '') {
      fetchCfaAddress()
    }
  }, [superfluidAragonAppContract, mounted, flow])

  return { flow, loading }
}
