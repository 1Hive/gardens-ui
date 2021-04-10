import { useEffect, useState } from 'react'
const CURRENCIES_URL = 'https://api.exchangeratesapi.io/latest?base=USD'
const SYMBOL_MAP = {
  USD: '$',
  EUR: '€',
  CAD: 'CAD $',
  HKD: 'HK $',
  AUD: 'AUD $',
  JPY: '¥',
  GBP: '£',
  TRY: '₺',
  CNY: 'CN ¥',
  KRW: '₩',
  RUB: '₽',
}
const RETRY_EVERY = 3000
export function useCurrencies() {
  const [currencies, setCurrencies] = useState([])

  useEffect(() => {
    let cancelled = false
    let retryTimer
    async function fetchRates() {
      try {
        const result = await (await fetch(CURRENCIES_URL)).json()
        if (!result?.rates || cancelled) {
          return
        }

        const rates = Object.keys(result.rates)
          // To ensure the dropdown is not too big, we only
          // map currencies that we have mapped a symbol for
          .filter(name => !!SYMBOL_MAP[name])
          .map(name => ({
            name,
            symbol: SYMBOL_MAP[name],
            rate: result.rates[name],
          }))
        setCurrencies(rates)
      } catch (err) {
        retryTimer = setTimeout(fetchRates, RETRY_EVERY)
      }
    }

    fetchRates()

    return () => {
      cancelled = true
      clearTimeout(retryTimer)
    }
  }, [])
  return orderCurrencies(currencies)
}

// Always puts USD at index 0
function orderCurrencies(currencies) {
  return currencies.sort(({ name }) => {
    if (name === 'USD') {
      return -1
    }
    return 0
  })
}
