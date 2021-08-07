import { useEffect, useState } from 'react'

import gql from 'graphql-tag'
import { Client } from 'urql'

const RETRY_EVERY = 3000

const HONEYSWAP_URL =
  'https://api.thegraph.com/subgraphs/name/1hive/honeyswap-v2'

const graphqlClient = new Client({ url: HONEYSWAP_URL })

const TOKEN_PRICE_QUERY = tokenAddress => gql`
  query {
    token(id: "${tokenAddress}") {
      derivedETH
    }
  }
`

export function useHoneyswapTokenPrice(tokenAddress) {
  const [tokenPrice, setTokenPrice] = useState(-1)

  useEffect(() => {
    let cancelled = false
    let retryTimer
    async function fetchPrice() {
      try {
        const result = await graphqlClient
          .query(TOKEN_PRICE_QUERY(tokenAddress))
          .toPromise()

        if (!result?.data) {
          return
        }

        const { token } = result.data
        const tokenPrice = token.derivedETH

        if (!cancelled) {
          setTokenPrice(parseFloat(tokenPrice).toFixed(2))
        }
      } catch (err) {
        retryTimer = setTimeout(fetchPrice, RETRY_EVERY)
      }
    }

    fetchPrice()

    return () => {
      cancelled = true
      clearTimeout(retryTimer)
    }
  }, [tokenAddress])

  return tokenPrice
}
