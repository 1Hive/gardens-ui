import { useEffect, useState } from 'react'
import { useContractReadOnly } from './useContract'
import { useMounted } from './useMounted'
import tokenAbi from '@abis/minimeToken.json'
import BigNumber from '@lib/bigNumber'

export function useTokenBalanceOf(tokenAddress, account) {
  const [balance, setBalance] = useState(new BigNumber(-1))
  const tokenContract = useContractReadOnly(tokenAddress, tokenAbi)

  useEffect(() => {
    const fetchTokenBalanceOf = async () => {
      const result = await tokenContract.balanceOf(account)

      setBalance(new BigNumber(result.toString()))
    }

    fetchTokenBalanceOf()
  }, [account, tokenContract])

  return balance
}

export function useTokenData(tokenAddress) {
  const [tokenData, setTokenData] = useState({ decimals: 18, symbol: '' })
  const [loading, setLoading] = useState(true)

  const mounted = useMounted()
  const tokenContract = useContractReadOnly(tokenAddress, tokenAbi)

  useEffect(() => {
    const fetchTokenData = async () => {
      const decimals = await tokenContract.decimals()
      const symbol = await tokenContract.symbol()

      if (mounted()) {
        setTokenData({ decimals, symbol })
        setLoading(false)
      }
    }

    fetchTokenData()
  }, [mounted, tokenContract])

  return [tokenData, loading]
}
