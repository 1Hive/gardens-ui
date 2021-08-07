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
  const [tokenData, setTokenData] = useState({
    name: '',
    decimals: 18,
    symbol: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const mounted = useMounted()
  const tokenContract = useContractReadOnly(tokenAddress, tokenAbi)

  useEffect(() => {
    const fetchTokenData = async () => {
      if (tokenAddress) {
        setError(null)
        setTokenData({ name: '', decimals: 18, symbol: '' })
        setLoading(true)
      }
      try {
        const name = await tokenContract.name()
        const symbol = await tokenContract.symbol()
        const decimals = await tokenContract.decimals()
        if (mounted()) {
          setTokenData({ name, decimals, symbol })
          setLoading(false)
        }
      } catch (error) {
        setLoading(false)
        setError(error)
      }
    }

    if (!tokenContract) {
      return
    }
    fetchTokenData()
  }, [mounted, tokenContract, tokenAddress])

  return [tokenData, loading, error]
}
