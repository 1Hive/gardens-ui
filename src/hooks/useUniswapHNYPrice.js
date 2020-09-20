import { useEffect, useState } from 'react'

import gql from 'graphql-tag'
import { Client } from 'urql'

const RETRY_EVERY = 3000

const UNISWAP_URL = 'https://api.thegraph.com/subgraphs/name/1hive/uniswap-v2'
const XDAI_HNY_PAIR = '0x4505b262dc053998c10685dc5f9098af8ae5c8ad'

const graphqlClient = new Client({ url: UNISWAP_URL })

const HNY_PRICE_QUERY = gql`
  query {
    pair(id: "${XDAI_HNY_PAIR}") {
      token1Price
    }
  }
`

export function useUniswapHnyPrice() {
  const [hnyPrice, setHnyPrice] = useState(0)

  useEffect(() => {
    let cancelled = false
    let retryTimer
    async function fetchPrice() {
      try {
        const result = await graphqlClient.query(HNY_PRICE_QUERY).toPromise()

        if (!result?.data) {
          return
        }

        const { pair } = result.data
        const hnyPrice = pair.token1Price

        if (!cancelled) {
          setHnyPrice(parseFloat(hnyPrice).toFixed(2))
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
  }, [])

  return hnyPrice
}
