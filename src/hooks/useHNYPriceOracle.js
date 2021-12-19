import { useEffect, useState } from 'react'

import { fromDecimals } from '@utils/math-utils'

import { useWallet } from '@providers/Wallet'

import priceOracleAbi from '@abis/priceOracle.json'

import { getNetwork } from '../networks'
import { useContractReadOnly } from './useContract'
import { useMounted } from './useMounted'

export default function useHNYPriceOracle(amount) {
  const [convertedAmount, setConvertedAmount] = useState(-1)
  const [loading, setLoading] = useState(true)
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
  }, [amount, honeyToken, mounted, priceOracleContract, stableToken])

  return [convertedAmount, loading]
}
