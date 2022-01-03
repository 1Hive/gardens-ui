import { useEffect, useState } from 'react'
import { useConnectedGarden } from '@providers/ConnectedGarden'
import { useContractReadOnly } from './useContract'

import BigNumber from '@lib/bigNumber'
import { DISPUTE_STATE_ADJUDICATING } from '@utils/dispute-utils'
import { getNetwork } from '@/networks'

import arbitratorAbi from '@abis/arbitrator.json'
import disputeManagerAbi from '@abis/DisputeManager.json'

export function useDisputeState(disputeId: number) {
  const [disputeState, setDisputeState] = useState(null)
  const [roundState, setRoundState] = useState(null)

  const { chainId } = useConnectedGarden()
  const disputeManagerAddress = getNetwork(chainId).disputeManager
  const disputeManagerContract = useContractReadOnly(
    disputeManagerAddress,
    disputeManagerAbi,
    chainId
  )

  const timer = 5000

  useEffect(() => {
    if (!disputeManagerContract || !disputeId) {
      return
    }

    let cancelled = false

    const pollDisputeState = async () => {
      try {
        const disputeResult = await disputeManagerContract.getDispute(disputeId)
        const disputeStateResult = disputeResult[2]

        let roundStateResult
        if (disputeStateResult === DISPUTE_STATE_ADJUDICATING) {
          const lastRoundId = disputeResult[4]
          const roundResult = await disputeManagerContract.getRound(
            disputeId,
            lastRoundId
          )
          roundStateResult = roundResult[8]
        }

        if (!cancelled) {
          setDisputeState(disputeStateResult)

          if (roundStateResult) {
            setRoundState(roundStateResult)
          }
        }
      } catch (err) {
        console.error(`Error fetching dispute state ${err} retrying...`)
      }

      if (!cancelled) {
        setTimeout(pollDisputeState, timer)
      }
    }

    pollDisputeState()

    return () => {
      cancelled = true
    }
  }, [disputeId, disputeManagerContract])

  return [disputeState, roundState]
}

export function useDisputeFees(chainId: number) {
  const [fees, setFees] = useState<{
    token: any
    amount: BigNumber | null
    loading: boolean
  }>({
    token: null,
    amount: null,
    loading: true,
  })

  const arbitratorAddress = getNetwork(chainId).arbitrator
  const arbitratorContract = useContractReadOnly(
    arbitratorAddress,
    arbitratorAbi,
    chainId
  )

  useEffect(() => {
    if (!arbitratorContract) {
      setFees(fees => ({ ...fees, loading: false }))
      return
    }

    let cancelled = false

    const fetchDisputeFees = async () => {
      const result = await arbitratorContract.getDisputeFees()

      if (!cancelled) {
        setFees({
          amount: new BigNumber(result.feeAmount.toString()),
          token: result.feeToken,
          loading: false,
        })
      }
    }

    fetchDisputeFees()

    return () => {
      cancelled = true
    }
  }, [arbitratorContract])

  return fees
}
