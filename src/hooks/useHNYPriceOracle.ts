import { useEffect, useState } from 'react'
import { useContractReadOnly } from './useContract'
import { useMounted } from './useMounted'
import { useWallet } from '@providers/Wallet'
import { getNetwork } from '../networks'
import { fromDecimals } from '@utils/math-utils'

import priceOracleAbi from '@abis/priceOracle.json'

export default function useHNYPriceOracle(amount: number) {
  const [convertedAmount, setConvertedAmount] = useState<string | number>(-1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { chainId } = useWallet()

  const { stableToken, honeyToken, honeyPriceOracle } = getNetwork(chainId)

  const mounted = useMounted()

  const priceOracleContract = useContractReadOnly(
    honeyPriceOracle,
    priceOracleAbi,
    chainId
  )

  useEffect(() => {
    if (!priceOracleContract) {
      console.log(`priceOracleContract not found`)
      setLoading(false)
      return
    }

    const fetchConvertedAmount = async () => {
      try {
        const result = await priceOracleContract.consult(
          honeyToken,
          amount.toString(10),
          stableToken
        )
        console.log(`consult ${result}`)
        if (mounted()) {
          setConvertedAmount(
            parseFloat(fromDecimals(result.toString(), 18)).toFixed(2)
          )
        }
      } catch (err) {
        setLoading(false)
        let msgError = 'Error unknown'
        const errAny = err as any
        if ('reason' in errAny) {
          if (errAny.reason.includes('MISSING_HISTORICAL_OBSERVATION')) {
            msgError = `PriceOracle need be updated at ${honeyPriceOracle}`
            console.log(msgError)
            setError(msgError)
          }
        }

        console.error(`Error consulting converted amount ${err}`)
      }
    }

    fetchConvertedAmount()
  }, [amount, honeyToken, mounted, priceOracleContract, stableToken])

  return [convertedAmount, loading, error]
}
