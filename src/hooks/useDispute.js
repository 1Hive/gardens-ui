import { useEffect, useState } from 'react'
import { getNetwork } from '../networks'
import arbitratorAbi from '../abi/arbitrator.json'
import disputeManagerAbi from '../abi/DisputeManager.json'
import { useContractReadOnly } from './useContract'
import { DISPUTE_STATE_ADJUDICATING } from '../utils/dispute-utils'

export function useDisputeState(disputeId) {
  const [disputeState, setDisputeState] = useState(null)
  const [roundState, setRoundState] = useState(null)

  const disputeManagerAddress = getNetwork().disputeManager
  const disputeManagerContract = useContractReadOnly(
    disputeManagerAddress,
    disputeManagerAbi
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

export function useDisputeFees() {
  const [fees, setFees] = useState({
    token: null,
    amount: null,
    loading: true,
  })
  const arbitratorAddress = getNetwork().arbitrator
  const arbitratorContract = useContractReadOnly(
    arbitratorAddress,
    arbitratorAbi
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
          amount: result.feeAmount,
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
