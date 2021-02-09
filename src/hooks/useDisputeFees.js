import { useEffect, useState } from 'react'
import { getNetwork } from '../networks'
import arbitratorAbi from '../abi/arbitrator.json'
import { useContractReadOnly } from './useContract'

export default function useDisputeFees() {
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
