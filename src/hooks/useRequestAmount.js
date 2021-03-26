import { useEffect, useState } from 'react'
import { useAppState } from '../providers/AppState'
import { useContractReadOnly } from './useContract'
import { useMounted } from './useMounted'
import BigNumber from '../lib/bigNumber'

import priceOracleAbi from '../abi/priceOracle.json'

export default function useRequestAmount(stable, amount, tokenIn, tokenOut) {
  const [convertedAmount, setConvertedAmount] = useState(new BigNumber(0))
  const [loading, setLoading] = useState(true)

  const mounted = useMounted()

  const { config } = useAppState()
  const priceOracleAddress = config.conviction.stableTokenOracle

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
        console.error(`Error consulting converted amount ${err}`)
      }
      setLoading(false)
    }

    fetchConvertedAmount()
  }, [amount, mounted, priceOracleContract, stable, tokenIn, tokenOut])

  return [convertedAmount, loading]
}
