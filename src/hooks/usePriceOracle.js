import { useEffect, useState } from 'react'
import { useContractReadOnly } from './useContract'
import { useGardens } from '@providers/Gardens'
import { useMounted } from './useMounted'

import BigNumber from '@lib/bigNumber'

import priceOracleAbi from '@abis/priceOracle.json'

export function usePriceOracle(stable, amount, tokenIn, tokenOut) {
  const mounted = useMounted()
  const [convertedAmount, setConvertedAmount] = useState(new BigNumber(0))
  const [loading, setLoading] = useState(true)
  const [canUpdate, setCanUpdate] = useState(false)

  const { connectedGarden } = useGardens()
  const { incentivisedPriceOracle: priceOracleAddress } = connectedGarden

  const priceOracleContract = useContractReadOnly(
    priceOracleAddress,
    priceOracleAbi
  )

  useEffect(() => {
    if (!stable || !priceOracleContract) {
      if (!stable) {
        setConvertedAmount(amount)
      }

      setLoading(false)
      return
    }

    const fetchConvertedAmount = async () => {
      try {
        const result = await priceOracleContract.consult(
          tokenIn,
          amount.toString(10),
          tokenOut
        )
        if (mounted()) {
          setConvertedAmount(new BigNumber(result.toString()))
        }
      } catch (err) {
        console.error(`Error consulting converted amount: ${err}`)
      }
      setLoading(false)
    }

    const fetchCanUpdate = async () => {
      try {
        const result = await priceOracleContract.canUpdate(tokenIn, tokenOut)
        setCanUpdate(result)
      } catch (err) {
        console.error(`Error fetching if Price Oracle can update: ${err}`)
      }
    }
    fetchConvertedAmount()
    fetchCanUpdate()
  }, [tokenIn, tokenOut, priceOracleContract, amount, mounted, stable])
  return [convertedAmount, loading, canUpdate]
}
