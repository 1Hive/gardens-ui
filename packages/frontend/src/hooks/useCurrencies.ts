import { useEffect, useState } from 'react'

const CURRENCIES_URL = 'https://api.exchangeratesapi.io/latest?base=USD'
const RETRY_EVERY = 3000

const CurrenciesMap: {
  [key: string]: string
} = {
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

type RateType = {
  name: string
  symbol: string
  rate: any
}

export function useCurrencies() {
  const [currencies, setCurrencies] = useState<RateType[]>([])

  useEffect(() => {
    let cancelled = false
    let retryTimer: number

    async function fetchRates() {
      try {
        const result = await (await fetch(CURRENCIES_URL)).json()
        if (!result?.rates || cancelled) {
          return
        }

        const rates = Object.keys(result.rates)
          // To ensure the dropdown is not too big, we only
          // map currencies that we have mapped a symbol for
          .filter(name => !!CurrenciesMap[name])
          .map(name => ({
            name,
            symbol: CurrenciesMap[name],
            rate: result.rates[name],
          }))

        setCurrencies(rates)
      } catch (err) {
        retryTimer = window.setTimeout(fetchRates, RETRY_EVERY)
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
function orderCurrencies(currencies: RateType[]) {
  return currencies.sort(({ name }) => {
    if (name === 'USD') {
      return -1
    }
    return 0
  })
}
