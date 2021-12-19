import BigNumber from '@lib/bigNumber'

import { toDecimals } from '../math-utils'
import { formatTokenAmount } from '../token-utils'

type Amount = {
  value: string
  valueBN: BigNumber
}

xit('test return NaN with not provied arguments', () => {
  const result = formatTokenAmount()
  expect(result).toBe('NaN')
})

xit('toDecimals need evaluate cientific notation', () => {
  const value = '1e18'
  const stakeToken = {
    decimals: 18,
  }
  const aa = new BigNumber(value).toString()

  console.log(aa)
  expect(aa).toBe('1000000000000000000')

  const newAmount = aa.replace(/,/g, '.').replace(/-/g, '')

  const afterDecimals = toDecimals(newAmount, stakeToken.decimals)
  expect(afterDecimals).toBe('1000000000000000000')
})

it('toDecimals need evaluate value 13,050,000 with 3 decimals to 13050', () => {
  const value = '13,050,000'
  const stakeToken = {
    decimals: 3,
  }
  expect(value.replace(/,/g, '.').replace(/-/g, '')).toBe('13.050.000')

  const newAmount = value.replace(/,/g, '.').replace(/-/g, '')

  const afterDecimals = toDecimals(newAmount, stakeToken.decimals)
  expect(afterDecimals).toBe('13050')

  const afterBigNumber = new BigNumber(afterDecimals).toString()

  console.log(afterBigNumber)
  expect(afterBigNumber).toBe('13050')
})

it('need evaluate value with "e" or "-" (minus sign) to 0', () => {
  let value = '-112'
  const stakeToken = {
    decimals: 3,
  }

  value = /e|-/g.test(value) ? '0' : value

  expect(value.replace(/,/g, '.').replace(/-/g, '')).toBe('0')

  const newAmount = value.replace(/,/g, '.').replace(/-/g, '')

  const afterDecimals = toDecimals(newAmount, stakeToken.decimals)
  expect(afterDecimals).toBe('0')

  const afterBigNumber = new BigNumber(afterDecimals).toString()

  expect(afterBigNumber).toBe('0')
})

xit('test formatTokenAmount', () => {
  const value = '1e18'
  const stakeToken = {
    decimals: 18,
  }
  const newAmount = value.replace(/,/g, '.').replace(/-/g, '')

  const newAmountBN = new BigNumber(
    isNaN(Number.parseInt(value))
      ? -1
      : toDecimals(newAmount, stakeToken.decimals)
  )
  console.log(toDecimals(newAmount, stakeToken.decimals))
  expect(newAmountBN.toString()).not.toBe(Number.POSITIVE_INFINITY.toString())
  console.log(newAmountBN.toString())
  const amount: Amount = {
    value: '',
    valueBN: newAmountBN,
  }
  const newValue = amount.valueBN.gte(0)
  const result = formatTokenAmount(amount.valueBN, 5)
  expect(result).toBe('')
})
