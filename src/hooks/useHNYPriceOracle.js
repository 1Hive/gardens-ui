import { useEffect, useState } from 'react'
import { useContractReadOnly } from './useContract'
import { useMounted } from './useMounted'
import { useWallet } from '@providers/Wallet'
import { getNetwork } from '../networks'
import { fromDecimals } from '@utils/math-utils'

import priceOracleAbi from '@abis/priceOracle.json'

const { stableToken, honeyToken, honeyPriceOracle } = getNetwork()

export default function useHNYPriceOracle(amount) {
  const [convertedAmount, setConvertedAmount] = useState(-1)
  const [loading, setLoading] = useState(true)
  const { chainId } = useWallet()

  const mounted = useMounted()

  const priceOracleContract = useContractReadOnly(
    honeyPriceOracle,
    priceOracleAbi,
    chainId
  )

  useEffect(() => {
    if (!priceOracleContract) {
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
        if (mounted()) {
          setConvertedAmount(
            parseFloat(fromDecimals(result.toString(), 18)).toFixed(2)
          )
        }
      } catch (err) {
        console.error(`Error consulting converted amount ${err}`)
      }
      setLoading(false)
    }

    fetchConvertedAmount()
  }, [amount, mounted, priceOracleContract])

  return [convertedAmount, loading]
}
