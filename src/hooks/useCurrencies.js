import { useEffect, useState } from 'react'
const RETRY_EVERY = 3000

const CURRENCIES_URL = 'https://api.exchangeratesapi.io/latest?base=USD'

export function useCurrencies() {
  const [rates, setRates] = useState(0)
  useEffect(() => {
    let cancelled = false
    let retryTimer
    async function fetchPrice() {
      try {
        const result = await (await fetch(CURRENCIES_URL)).json()
        if (!result?.rates) {
          return
        }

        const rates = result.rates

        if (!cancelled) {
          setRates(rates)
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

  return rates
}
